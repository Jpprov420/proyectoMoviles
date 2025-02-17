#OS permite acceder a las variables de entorno
import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

# Cargar variables de entorno desde .env
load_dotenv()

def create_app():
    app = Flask(__name__) # Crea una instancia de Flask
    CORS(app)  # Habilitar CORS para evitar restricciones en las peticiones del frontend

    # Guardar las variable de entorno previamente cargadas por load_dotenv() en la configuración de Flask
    app.config["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")
    app.config["GOOGLE_MAPS_API_KEY"] = os.getenv("GOOGLE_MAPS_API_KEY")

    # Registrar las rutas del chatbot
    from .routes import chatbot_routes # Trae el bluprint chatbot_routes del archivo routes
    app.register_blueprint(chatbot_routes) # Registramos el bluepint en el servidor de Flask (Un Blueprint es un modulo que agrupa rutas relacionadas)

    return app
