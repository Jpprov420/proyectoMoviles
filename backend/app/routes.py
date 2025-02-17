# current_app accede a la configuración de flask donde están las variables de entorno
import os
import requests
from flask import Blueprint, request, jsonify, current_app
import openai
import googlemaps
from dotenv import load_dotenv
from .utils import extraer_lugares

# 🔄 Cargar variables de entorno desde .env
load_dotenv()

chatbot_routes = Blueprint("chatbot", __name__)

# 🔑 Configuración de API Keys desde .env
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")
GOOGLE_CUSTOM_SEARCH_API_KEY = os.getenv("GOOGLE_CUSTOM_SEARCH_API_KEY")
SEARCH_ENGINE_ID = os.getenv("SEARCH_ENGINE_ID")

# 🔄 Inicializar clientes
openai_client = openai.OpenAI(api_key=OPENAI_API_KEY)
gmaps = googlemaps.Client(key=GOOGLE_MAPS_API_KEY)

def buscar_imagen_bus(nombre_bus):
    """
    Realiza una búsqueda en Google Custom Search y devuelve hasta 3 imágenes de autobuses reales,
    evitando redes sociales, mapas, esquemas y diagramas.
    """
    google_api_key = os.getenv("GOOGLE_CUSTOM_SEARCH_API_KEY")
    search_engine_id = os.getenv("SEARCH_ENGINE_ID")

    if not google_api_key or not search_engine_id:
        print("❌ Faltan las credenciales de Google Custom Search API.")
        return ["❌ No se encontraron imágenes adecuadas."]

    if not nombre_bus or nombre_bus.strip() == "":
        print("⚠️ No se detectó un nombre de línea de bus válido.")
        return ["❌ No se encontraron imágenes adecuadas."]

    # 🔍 Construcción de la consulta optimizada
    consulta_busqueda = f"{nombre_bus} foto del autobus real"

    print(f"🔍 Consulta enviada a Google Custom Search: {consulta_busqueda}")

    url = "https://www.googleapis.com/customsearch/v1"

    params = {
        "q": consulta_busqueda,
        "cx": search_engine_id,
        "key": google_api_key,
        "searchType": "image",
        "num": 10,  # Buscamos más imágenes para filtrar mejor
        "imgSize": "large",  # Preferimos imágenes grandes
    }

    response = requests.get(url, params=params)
    data = response.json()

    # 🚫 Lista de dominios a evitar (redes sociales y otras fuentes no confiables)
    dominios_bloqueados = [
        "facebook.com", "fbcdn.net", "instagram.com", "tiktok.com", "twitter.com", "x.com",
        "pinterest.com", "reddit.com", "quora.com"
    ]

    if "items" in data:
        imagenes = []
        for item in data["items"]:
            image_url = item["link"]
            site_url = item.get("image", {}).get("contextLink", "")

            # 🚫 Evitar imágenes de redes sociales y contenido irrelevante
            if any(domain in image_url.lower() or domain in site_url.lower() for domain in dominios_bloqueados):
                continue  # Saltar esta imagen

            # 🚫 Evitar imágenes con palabras clave no deseadas
            if any(word in image_url.lower() for word in ["mapa", "ruta", "diagrama", "esquema", "recorrido", "itinerario"]):
                continue  # Saltar esta imagen

            # ✅ Solo agregamos imágenes que pasen todos los filtros
            imagenes.append(image_url)

            if len(imagenes) == 3:
                break  # Detenemos la búsqueda al encontrar 3 imágenes válidas

        if imagenes:
            print(f"🖼️ Imágenes encontradas: {imagenes}")
            return imagenes

    print("⚠️ No se encontraron imágenes adecuadas.")
    return ["❌ No se encontraron imágenes adecuadas."]



@chatbot_routes.route("/chat", methods=["POST"])
def chat():
    try:
        if not request.is_json:
            return jsonify({"error": "Solicitud inválida. Asegúrate de enviar un JSON."}), 400

        data = request.get_json()
        print(f"📥 Datos recibidos en Flask: {data}")

        if "message" not in data or not data["message"]:
            return jsonify({"error": "Mensaje vacío o incorrecto."}), 400

        user_message = data["message"]

        if not OPENAI_API_KEY or not GOOGLE_MAPS_API_KEY:
            return jsonify({"error": "Faltan las API Keys en la configuración."}), 500

        try:
            origen, destino = extraer_lugares(user_message)
            print(f"📍 Origen detectado: {origen} | Destino detectado: {destino}")
        except ValueError as e:
            print(f"❌ Error al extraer lugares: {str(e)}")
            return jsonify({"error": str(e)}), 400

        ruta_info = obtener_ruta_transporte(origen, destino, gmaps)
        print("Rutaaa!!!!!!")
        print(ruta_info)

        # 📝 **Prompt mejorado con detalles adicionales**
        prompt = f"""
        Eres un asistente experto en navegación de buses en Quito. Tu objetivo es proporcionar instrucciones 
        claras, detalladas y naturales para que el usuario entienda perfectamente cómo llegar a su destino.

        Detalla bien los siguientes puntos:
        - Explica **cuánto tardará** aproximadamente en llegar.
        - **Qué debe hacer al subir al bus** y **qué señales debe observar**.
        - **Cómo saber cuándo bajarse** y **qué hacer después**.
        - **Si hay algo importante que el usuario deba considerar**, como horas pico o seguridad.

        🔹 Aquí está la información de la ruta:
        {ruta_info['ruta']}

        Formatea la respuesta con párrafos claros y utiliza emojis para hacerla más amigable.
        """

        response = openai_client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "Eres un asistente de navegación detallado que proporciona instrucciones precisas."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.4  # 🎯 Configuración de temperatura
        )

        bot_response = response.choices[0].message.content
        bus_images = ruta_info["imagenes"]

        return jsonify({"response": bot_response, "bus_images": bus_images})

    except Exception as e:
        print(f"❌ Error en el backend: {e}")
        return jsonify({"error": "Error interno del servidor."}), 500


def obtener_ruta_transporte(origen, destino, gmaps):
    """
    Obtiene la mejor ruta de transporte público con base en tráfico y tiempo real.
    """
    try:
        rutas = gmaps.directions(
            origin=origen,
            destination=destino,
            mode="transit",
            departure_time="now",
            region="ec"
        )

        if not rutas:
            return {"ruta": "❌ No se encontraron rutas de transporte público disponibles.", "imagenes": []}

        ruta_mas_corta = min(rutas, key=lambda r: r["legs"][0]["duration"]["value"])
        duracion_total = ruta_mas_corta["legs"][0]["duration"]["text"]

        print(f"✅ Mejor ruta seleccionada: {duracion_total}")

        pasos = []
        nombre_bus = None

        for i, paso in enumerate(ruta_mas_corta["legs"][0]["steps"]):
            if "transit_details" in paso:
                detalles = paso["transit_details"]
                nombre_bus = detalles["line"]["agencies"][0]["name"]  # ✅ Solo el nombre de la cooperativa
                estacion_inicio = detalles["departure_stop"]["name"]
                estacion_fin = detalles["arrival_stop"]["name"]
                duracion = paso["duration"]["text"]

                pasos.append(
                    f"{i+1}️⃣ 🚍 **Bus:** {nombre_bus}\n"
                    f"📍 **Desde:** {estacion_inicio}\n"
                    f"🛑 **Hasta:** {estacion_fin}\n"
                    f"⏳ **Duración:** {duracion}\n"
                )

        imagenes_bus = buscar_imagen_bus(nombre_bus) if nombre_bus else []

        return {
            "ruta": "\n".join(pasos),
            "imagenes": imagenes_bus
        }

    except Exception as e:
        return {"ruta": f"❌ Error al obtener la ruta: {str(e)}", "imagenes": []}
