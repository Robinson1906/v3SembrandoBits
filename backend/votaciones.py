"""
Módulo de Votaciones
Maneja el almacenamiento y gestión de calificaciones de usuarios
"""

from flask import Blueprint, request, jsonify
from datetime import datetime
from database import get_db

votaciones_bp = Blueprint('votaciones', __name__)

# Obtener la colección de votaciones
def get_votaciones_collection():
    db = get_db()
    return db['votaciones']

@votaciones_bp.route('/votacion', methods=['POST'])
def guardar_votacion():
    """
    Guardar una nueva votación en la base de datos
    
    Body esperado:
    {
        "rating": 1-5,
        "dispositivo": 1-3 (opcional),
        "cultivo": "nombre" (opcional),
        "medio": "terreno" | "aire" (opcional)
    }
    """
    try:
        data = request.get_json()
        
        # Validar que exista el rating
        if 'rating' not in data:
            return jsonify({
                'error': 'El campo rating es obligatorio'
            }), 400
        
        rating = data.get('rating')
        
        # Validar rango de rating
        if not isinstance(rating, int) or rating < 1 or rating > 5:
            return jsonify({
                'error': 'El rating debe ser un número entre 1 y 5'
            }), 400
        
        # Crear documento de votación
        votacion = {
            'rating': rating,
            'dispositivo': data.get('dispositivo'),
            'cultivo': data.get('cultivo'),
            'medio': data.get('medio'),
            'fecha': datetime.utcnow(),
            'timestamp': datetime.utcnow().isoformat()
        }
        
        # Guardar en la base de datos
        votaciones_collection = get_votaciones_collection()
        resultado = votaciones_collection.insert_one(votacion)
        
        return jsonify({
            'mensaje': 'Votación guardada exitosamente',
            'id': str(resultado.inserted_id),
            'votacion': {
                'rating': votacion['rating'],
                'dispositivo': votacion['dispositivo'],
                'cultivo': votacion['cultivo'],
                'medio': votacion['medio'],
                'timestamp': votacion['timestamp']
            }
        }), 201
        
    except Exception as e:
        return jsonify({
            'error': f'Error al guardar la votación: {str(e)}'
        }), 500

@votaciones_bp.route('/votaciones', methods=['GET'])
def obtener_votaciones():
    """
    Obtener todas las votaciones o filtrar por parámetros
    
    Query params opcionales:
    - rating: filtrar por calificación específica
    - dispositivo: filtrar por dispositivo
    - cultivo: filtrar por cultivo
    - medio: filtrar por medio (terreno/aire)
    - limit: límite de resultados (default: 100)
    """
    try:
        votaciones_collection = get_votaciones_collection()
        
        # Construir filtro
        filtro = {}
        
        if request.args.get('rating'):
            filtro['rating'] = int(request.args.get('rating'))
        
        if request.args.get('dispositivo'):
            filtro['dispositivo'] = int(request.args.get('dispositivo'))
        
        if request.args.get('cultivo'):
            filtro['cultivo'] = request.args.get('cultivo')
        
        if request.args.get('medio'):
            filtro['medio'] = request.args.get('medio')
        
        # Obtener límite
        limite = int(request.args.get('limit', 100))
        
        # Consultar votaciones
        votaciones = list(votaciones_collection.find(filtro)
                         .sort('fecha', -1)
                         .limit(limite))
        
        # Convertir ObjectId a string
        for votacion in votaciones:
            votacion['_id'] = str(votacion['_id'])
        
        return jsonify({
            'total': len(votaciones),
            'votaciones': votaciones
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': f'Error al obtener votaciones: {str(e)}'
        }), 500

@votaciones_bp.route('/votaciones/estadisticas', methods=['GET'])
def obtener_estadisticas():
    """
    Obtener estadísticas de las votaciones
    """
    try:
        votaciones_collection = get_votaciones_collection()
        
        # Calcular estadísticas usando agregación
        pipeline = [
            {
                '$group': {
                    '_id': None,
                    'total_votaciones': {'$sum': 1},
                    'promedio_rating': {'$avg': '$rating'},
                    'rating_1': {
                        '$sum': {'$cond': [{'$eq': ['$rating', 1]}, 1, 0]}
                    },
                    'rating_2': {
                        '$sum': {'$cond': [{'$eq': ['$rating', 2]}, 1, 0]}
                    },
                    'rating_3': {
                        '$sum': {'$cond': [{'$eq': ['$rating', 3]}, 1, 0]}
                    },
                    'rating_4': {
                        '$sum': {'$cond': [{'$eq': ['$rating', 4]}, 1, 0]}
                    },
                    'rating_5': {
                        '$sum': {'$cond': [{'$eq': ['$rating', 5]}, 1, 0]}
                    }
                }
            }
        ]
        
        resultado = list(votaciones_collection.aggregate(pipeline))
        
        if not resultado:
            return jsonify({
                'total_votaciones': 0,
                'promedio_rating': 0,
                'distribucion': {
                    '1': 0, '2': 0, '3': 0, '4': 0, '5': 0
                }
            }), 200
        
        stats = resultado[0]
        
        return jsonify({
            'total_votaciones': stats['total_votaciones'],
            'promedio_rating': round(stats['promedio_rating'], 2),
            'distribucion': {
                '1': stats['rating_1'],
                '2': stats['rating_2'],
                '3': stats['rating_3'],
                '4': stats['rating_4'],
                '5': stats['rating_5']
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': f'Error al obtener estadísticas: {str(e)}'
        }), 500

@votaciones_bp.route('/votaciones/<votacion_id>', methods=['DELETE'])
def eliminar_votacion(votacion_id):
    """
    Eliminar una votación específica
    """
    try:
        from bson import ObjectId
        votaciones_collection = get_votaciones_collection()
        
        resultado = votaciones_collection.delete_one({'_id': ObjectId(votacion_id)})
        
        if resultado.deleted_count == 0:
            return jsonify({
                'error': 'Votación no encontrada'
            }), 404
        
        return jsonify({
            'mensaje': 'Votación eliminada exitosamente'
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': f'Error al eliminar votación: {str(e)}'
        }), 500

@votaciones_bp.route('/votaciones', methods=['DELETE'])
def eliminar_todas_las_votaciones():
    """Eliminar todas las votaciones de la base de datos"""
    try:
        votaciones_collection = get_votaciones_collection()
        resultado = votaciones_collection.delete_many({})

        return jsonify({
            'mensaje': 'Todas las votaciones fueron eliminadas exitosamente',
            'eliminadas': resultado.deleted_count
        }), 200

    except Exception as e:
        return jsonify({
            'error': f'Error al eliminar todas las votaciones: {str(e)}'
        }), 500
