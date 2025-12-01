# backend/dispositivos.py
from flask import Blueprint, request, jsonify
from bson import ObjectId
from datetime import datetime
from database import get_db, log_error

dispositivos_bp = Blueprint('dispositivos', __name__)

def get_dispositivos_collection():
    db = get_db()
    return db.dispositivos if db is not None else None

def get_sensores_collection():
    db = get_db()
    return db.sensores if db is not None else None

@dispositivos_bp.route('/dispositivos', methods=['GET'])
def listar_dispositivos():
    """Lista todos los dispositivos disponibles."""
    dispositivos_collection = get_dispositivos_collection()
    if dispositivos_collection is None:
        return jsonify({"error": "Conexión a la base de datos no disponible"}), 503
    try:
        dispositivos = list(dispositivos_collection.find())
        for d in dispositivos:
            d['_id'] = str(d['_id'])
        return jsonify(dispositivos)
    except Exception as e:
        log_error(e, "listar_dispositivos")
        return jsonify({"error": str(e)}), 500

@dispositivos_bp.route('/dispositivos', methods=['POST'])
def crear_dispositivo():
    """Crea un nuevo dispositivo."""
    dispositivos_collection = get_dispositivos_collection()
    if dispositivos_collection is None:
        return jsonify({"error": "Conexión a la base de datos no disponible"}), 503
    try:
        data = request.get_json()
        nombre = data.get('nombre')
        ubicacion = data.get('ubicacion')

        if not nombre:
            return jsonify({"error": "El campo 'nombre' es requerido"}), 400

        nuevo_dispositivo = {
            "nombre": nombre,
            "ubicacion": ubicacion,
            "created_at": datetime.utcnow()
        }
        result = dispositivos_collection.insert_one(nuevo_dispositivo)
        return jsonify({"mensaje": "Dispositivo creado", "id": str(result.inserted_id)}), 201
    except Exception as e:
        log_error(e, "crear_dispositivo")
        return jsonify({"error": str(e)}), 500

@dispositivos_bp.route('/sensores/<string:sensor_id>/vincular', methods=['PUT'])
def vincular_sensor(sensor_id):
    """Vincula un sensor a un dispositivo."""
    sensores_collection = get_sensores_collection()
    if sensores_collection is None:
        return jsonify({"error": "Conexión a la base de datos no disponible"}), 503
    try:
        data = request.get_json()
        dispositivo_id = data.get('dispositivo_id')

        if not dispositivo_id:
            return jsonify({"error": "El campo 'dispositivo_id' es requerido"}), 400

        sensores_collection.update_one(
            {"_id": ObjectId(sensor_id)},
            {"$set": {"dispositivo_id": ObjectId(dispositivo_id), "updated_at": datetime.utcnow()}}
        )
        return jsonify({"mensaje": "Sensor vinculado correctamente"})
    except Exception as e:
        log_error(e, "vincular_sensor")
        return jsonify({"error": str(e)}), 500

@dispositivos_bp.route('/sensores/<string:sensor_id>/desvincular', methods=['PUT'])
def desvincular_sensor(sensor_id):
    """Desvincula un sensor de cualquier dispositivo."""
    sensores_collection = get_sensores_collection()
    if sensores_collection is None:
        return jsonify({"error": "Conexión a la base de datos no disponible"}), 503
    try:
        sensores_collection.update_one(
            {"_id": ObjectId(sensor_id)},
            {"$unset": {"dispositivo_id": ""}, "$set": {"updated_at": datetime.utcnow()}}
        )
        return jsonify({"mensaje": "Sensor desvinculado correctamente"})
    except Exception as e:
        log_error(e, "desvincular_sensor")
        return jsonify({"error": str(e)}), 500
