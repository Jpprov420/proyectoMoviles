from flask import Blueprint, Response
import json

main_routes = Blueprint('main', __name__)

@main_routes.route('/')
def home():
    response_data = {"message": "¡Bienvenido a Proyecto Móviles Backend!"}
    return Response(json.dumps(response_data, ensure_ascii=False), content_type="application/json; charset=utf-8")
