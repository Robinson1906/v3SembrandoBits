from flask import Blueprint, request, jsonify
from bson import ObjectId
from datetime import datetime

# Importar desde database en lugar de servidor (EVITA CIRCULAR IMPORT)
from database import get_medidas_collection, get_sensores_collection, get_db, log_error

def validar_valor_por_tipo(valor, tipo_campo, nombre_campo):
    """
    Valida y convierte un valor según el tipo de campo definido.
    
    Args:
        valor: Valor a validar
        tipo_campo: Tipo de campo ('boolean', 'float', 'integer', etc.)
        nombre_campo: Nombre del campo para mensajes de error
    
    Returns:
        tuple: (valor_convertido, mensaje_error)
        Si hay error, el primer elemento es None
    """
    if valor is None:
        return None, None
    
    if tipo_campo.lower() == 'boolean':
        # Usar la misma lógica de validación que en sensores.py
        if isinstance(valor, bool):
            return valor, None
        elif isinstance(valor, str):
            valor_lower = valor.lower()
            if valor_lower in ['true', '1', 'yes', 'on']:
                return True, None
            elif valor_lower in ['false', '0', 'no', 'off']:
                return False, None
            else:
                return None, f"El campo '{nombre_campo}' debe ser un booleano válido (true/false)"
        elif isinstance(valor, int):
            return bool(valor), None
        else:
            return None, f"El campo '{nombre_campo}' debe ser un booleano válido"
    elif tipo_campo.lower() in ['float', 'double']:
        try:
            return float(valor), None
        except (ValueError, TypeError):
            return None, f"El campo '{nombre_campo}' debe ser un número decimal válido"
    elif tipo_campo.lower() in ['integer', 'int']:
        try:
            return int(valor), None
        except (ValueError, TypeError):
            return None, f"El campo '{nombre_campo}' debe ser un número entero válido"
    else:
        # Para otros tipos, devolver el valor tal como está
        return valor, None

medidas_bp = Blueprint('medidas', __name__)

# Obtener colecciones desde database
medidas_collection = get_medidas_collection()
sensores_collection = get_sensores_collection()
db = get_db()

@medidas_bp.route('/guardar', methods=['POST'])
def guardar_medidas():
    """Guarda medidas de sensores en la base de datos. Espera un JSON con 'measures'."""
    if medidas_collection is None:
        return jsonify({"error": "Conexión a la base de datos no disponible"}), 503
    try:
        data = request.get_json()
        if not data or "measures" not in data:
            return jsonify({"error": "El JSON debe contener 'measures'"}), 400
        measures = data["measures"]
        medidas_a_insertar = []
        sensores_activos = list(sensores_collection.find({"activo": True}))
        mapa_sensores = {
            s['nombre']: {
                "id": s['_id'],
                "campos": {
                    c['nombre_campo']: {
                        'id': c['_id'],
                        'tipo': c['tipo_campo']
                    } for c in s.get('campos', []) if c.get('activo')
                }
            } for s in sensores_activos
        }
        for sensor_name, lecturas in measures.items():
            if sensor_name not in mapa_sensores:
                continue
            sensor_info = mapa_sensores[sensor_name]
            sensor_id = sensor_info['id']
            for lectura in lecturas:
                detalle = lectura.get("detail")
                valor_raw = lectura.get("value")
                
                if detalle in sensor_info['campos']:
                    campo_info = sensor_info['campos'][detalle]
                    campo_id = campo_info['id']
                    tipo_campo = campo_info['tipo']
                    
                    # Validar y convertir el valor según el tipo de campo
                    valor_validado, error_validacion = validar_valor_por_tipo(
                        valor_raw, tipo_campo, detalle
                    )
                    
                    if error_validacion:
                        return jsonify({"error": f"Sensor '{sensor_name}', campo '{detalle}': {error_validacion}"}), 400
                    
                    medidas_a_insertar.append({
                        "sensor_id": sensor_id,
                        "campo_id": campo_id,
                        "valor": valor_validado,
                        "timestamp": datetime.utcnow()
                    })
        if medidas_a_insertar:
            medidas_collection.insert_many(medidas_a_insertar)
        return jsonify({"status": "ok", "mensaje": "Medidas procesadas correctamente"})
    except Exception as e:
        log_error(e, "guardar_medidas")
        return jsonify({"error": str(e)}), 500

@medidas_bp.route('/medidas', methods=['GET'])
def obtener_medidas():
    """Obtiene medidas filtradas por parámetros opcionales: limite, sensor_id, campo_id, desde, hasta."""
    if medidas_collection is None:
        return jsonify({"error": "Conexión a la base de datos no disponible"}), 503
    try:
        limite = int(request.args.get('limite', 100))
        sensor_id = request.args.get('sensor_id')
        campo_id = request.args.get('campo_id')
        desde = request.args.get('desde')
        hasta = request.args.get('hasta')
        query = {}
        if sensor_id:
            query["sensor_id"] = ObjectId(sensor_id)
        if campo_id:
            query["campo_id"] = ObjectId(campo_id)
        if desde or hasta:
            query["timestamp"] = {}
            if desde:
                query["timestamp"]["$gte"] = datetime.fromisoformat(desde.replace('Z', '+00:00'))
            if hasta:
                query["timestamp"]["$lte"] = datetime.fromisoformat(hasta.replace('Z', '+00:00'))
        pipeline = [
            {"$match": query},
            {"$sort": {"timestamp": -1}},
            {"$limit": limite},
            {
                "$lookup": {
                    "from": "sensores",
                    "localField": "sensor_id",
                    "foreignField": "_id",
                    "as": "sensor_info"
                }
            },
            {"$unwind": "$sensor_info"},
            {"$unwind": "$sensor_info.campos"},
            {
                "$match": {
                    "$expr": {"$eq": ["$campo_id", "$sensor_info.campos._id"]}
                }
            },
            {
                "$project": {
                    "_id": {"$toString": "$_id"},  # Convertir ObjectId a string
                    "sensor": "$sensor_info.nombre",
                    "nombre_campo": "$sensor_info.campos.nombre_campo",
                    "valor": "$valor",
                    "timestamp": "$timestamp"
                }
            }
        ]
        medidas = list(medidas_collection.aggregate(pipeline))
        
        # Convertir timestamp a formato ISO para JSON y asegurar que los booleanos se muestren correctamente
        for medida in medidas:
            if 'timestamp' in medida and medida['timestamp']:
                medida['timestamp'] = medida['timestamp'].isoformat()
            
            # Convertir valores booleanos a string para que el frontend los muestre correctamente
            if 'valor' in medida and isinstance(medida['valor'], bool):
                medida['valor'] = str(medida['valor']).lower()  # true/false en minúsculas
        
        return jsonify(medidas)
    except Exception as e:
        log_error(e, "obtener_medidas")
        return jsonify({"error": str(e)}), 500

@medidas_bp.route('/dispositivo/<int:device_id>', methods=['GET'])
def obtener_datos_dispositivo(device_id):
    """Obtiene los últimos valores de sensores para un dispositivo lógico (1, 2 o 3).

    El número de dispositivo es una posición lógica que se mapea al
    dispositivo real en la colección "dispositivos" ordenado por fecha
    de creación. Luego se agregan los últimos valores de todos los sensores
    vinculados a ese dispositivo (por campo).
    """
    if medidas_collection is None or sensores_collection is None or db is None:
        return jsonify({"error": "Conexión a la base de datos no disponible"}), 503
    try:
        dispositivos_collection = db.dispositivos

        # Obtener dispositivos ordenados por fecha de creación (más antiguos primero)
        dispositivos = list(dispositivos_collection.find().sort("created_at", 1))
        if not dispositivos or device_id < 1 or device_id > len(dispositivos):
            return jsonify({"error": f"No existe el dispositivo lógico {device_id}. Total disponibles: {len(dispositivos)}"}), 404

        dispositivo_doc = dispositivos[device_id - 1]
        dispositivo_mongo_id = dispositivo_doc.get("_id")

        # Buscar todos los sensores vinculados a este dispositivo
        sensores_vinculados = list(sensores_collection.find({
            "dispositivo_id": dispositivo_mongo_id,
            "activo": True
        }))

        if not sensores_vinculados:
            return jsonify({
                "dispositivo": device_id,
                "dispositivo_mongo_id": str(dispositivo_mongo_id),
                "dispositivo_nombre": dispositivo_doc.get("nombre"),
                "datos": {},
                "sensores": []
            })

        datos_dispositivo = {}
        sensores_info = []

        for sensor in sensores_vinculados:
            sensor_id = sensor["_id"]
            campos = sensor.get("campos", [])
            sensor_nombre = sensor.get("nombre")

            sensor_campos = {}
            for campo in campos:
                if not campo.get("activo", True):
                    continue
                campo_id = campo["_id"]
                nombre_campo = campo["nombre_campo"]

                ultima_medida = medidas_collection.find_one(
                    {"sensor_id": sensor_id, "campo_id": campo_id},
                    sort=[("timestamp", -1)]
                )

                if ultima_medida:
                    valor = ultima_medida["valor"]
                    if isinstance(valor, bool):
                        valor = str(valor).lower()
                    sensor_campos[nombre_campo] = valor
                    datos_dispositivo[nombre_campo] = valor
                else:
                    sensor_campos[nombre_campo] = None
                    datos_dispositivo.setdefault(nombre_campo, None)

            sensores_info.append({
                "sensor_id": str(sensor_id),
                "nombre": sensor_nombre,
                "campos": sensor_campos
            })

        return jsonify({
            "dispositivo": device_id,
            "dispositivo_mongo_id": str(dispositivo_mongo_id),
            "dispositivo_nombre": dispositivo_doc.get("nombre"),
            "datos": datos_dispositivo,
            "sensores": sensores_info
        })
    except Exception as e:
        log_error(e, "obtener_datos_dispositivo")
        return jsonify({"error": str(e)}), 500

@medidas_bp.route('/estado', methods=['GET'])
def estado_sistema():
    """Retorna el estado del sistema: conexión, total sensores, total medidas, última medida."""
    try:
        total_sensores = sensores_collection.count_documents({}) if sensores_collection is not None else 0
        total_medidas = medidas_collection.count_documents({}) if medidas_collection is not None else 0
        ultima_medida = medidas_collection.find_one(
            {},
            {"sort": [("timestamp", -1)], "projection": {"timestamp": 1}}
        ) if medidas_collection is not None else None

        # Convertir timestamp si existe
        ultima_medida_timestamp = None
        if ultima_medida and 'timestamp' in ultima_medida:
            ultima_medida_timestamp = ultima_medida['timestamp'].isoformat()

        return jsonify({
            "estado": "conectado" if medidas_collection is not None else "desconectado",
            "total_sensores": total_sensores,
            "total_medidas": total_medidas,
            "ultima_medida": ultima_medida_timestamp
        })
    except Exception as e:
        log_error(e, "estado_sistema")
        return jsonify({"error": str(e)}), 500
