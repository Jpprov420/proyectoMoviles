from flask import Blueprint, request, jsonify, current_app
import openai
import googlemaps
from .utils import extraer_lugares

# Crear Blueprint para el chatbot
chatbot_routes = Blueprint("chatbot", __name__)

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

        # Obtener las API Keys desde Flask
        openai_api_key = current_app.config.get("OPENAI_API_KEY")
        google_maps_api_key = current_app.config.get("GOOGLE_MAPS_API_KEY")

        if not openai_api_key or not google_maps_api_key:
            return jsonify({"error": "Faltan las API Keys en la configuración."}), 500

        # Inicializar clientes de OpenAI y Google Maps
        openai_client = openai.OpenAI(api_key=openai_api_key)
        gmaps = googlemaps.Client(key=google_maps_api_key)

        # Extraer lugares desde el mensaje
        try:
            origen, destino = extraer_lugares(user_message)
            print(f"📍 Origen detectado: {origen} | Destino detectado: {destino}")
        except ValueError as e:
            print(f"❌ Error al extraer lugares: {str(e)}")
            return jsonify({"error": str(e)}), 400

        # Obtener la mejor ruta de transporte público
        ruta = obtener_ruta_transporte(origen, destino, gmaps)

        # Generar respuesta con OpenAI
        response = openai_client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "Eres un asistente que me da la ruta mas corta de buses en Quito."},
                {"role": "user", "content": f"{user_message}"},
                {"role": "assistant", "content": ruta}
            ]
        )

        bot_response = response.choices[0].message.content
        return jsonify({"response": bot_response})

    except Exception as e:
        print(f"❌ Error en el backend: {e}")
        return jsonify({"error": "Error interno del servidor."}), 500


def obtener_ruta_transporte(origen, destino, gmaps):
    """
    Obtiene la mejor ruta de transporte público con base en el tiempo más corto.
    """
    try:
        rutas = gmaps.directions(
            origen,
            destino,
            mode="transit",
            departure_time="now",  # Usamos tráfico en tiempo real
            alternatives=True  # Pedimos múltiples opciones
        )

        if not rutas:
            return "❌ No se encontraron rutas de transporte público disponibles."

        # Ordenamos las rutas por duración en segundos y elegimos la más rápida
        ruta_mas_corta = min(rutas, key=lambda r: r["legs"][0]["duration"]["value"])
        duracion_total = ruta_mas_corta["legs"][0]["duration"]["text"]

        print(f"✅ Mejor ruta seleccionada: {duracion_total}")

        pasos = []
        for i, paso in enumerate(ruta_mas_corta["legs"][0]["steps"]):
            if "transit_details" in paso:
                detalles = paso["transit_details"]
                nombre_linea = detalles["line"]["short_name"]
                agencia = detalles["line"]["agencies"][0]["name"]
                estacion_inicio = detalles["departure_stop"]["name"]
                estacion_fin = detalles["arrival_stop"]["name"]
                duracion = paso["duration"]["text"]

                pasos.append(
                    f"{i+1}️⃣ 🚍 **Bus:** {nombre_linea} ({agencia})\n"
                    f"📍 **Desde:** {estacion_inicio}\n"
                    f"🛑 **Hasta:** {estacion_fin}\n"
                    f"⏳ **Duración:** {duracion}\n"
                )
            else:
                pasos.append(f"{i+1}️⃣ 🚶 {paso['html_instructions']}")

        return f"🕒 **Tiempo estimado:** {duracion_total}\n\n" + "\n".join(pasos)

    except Exception as e:
        return f"❌ Error al obtener la ruta: {str(e)}"
