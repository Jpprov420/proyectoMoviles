#current_app accede a la configuración de flask donde estan las variables de entorno
from flask import Blueprint, request, jsonify, current_app
import openai
import googlemaps
from .utils import extraer_lugares
import pandas as pd
import os

# Crear Blueprint para el chatbot
chatbot_routes = Blueprint("chatbot", __name__)


BASE_DIR = os.path.dirname(os.path.abspath(__file__)) # Ruta base del proyecto
EXCEL_PATH = os.path.join(BASE_DIR, "Data", "Transporte.xlsx")  # Ruta del archivo

df_buses = pd.read_excel(EXCEL_PATH) # cargamos los datos del excel a un data frame


#Asociamos una función con una ruta específica de la API, la ruta sería /chat
@chatbot_routes.route("/chat", methods=["POST"])
def chat():
    try:
        if not request.is_json:
            return jsonify({"error": "Solicitud inválida. Asegúrate de enviar un JSON."}), 400

        data = request.get_json()
        print(f"📥 Datos recibidos en Flask: {data}")

        if "message" not in data or not data["message"]:
            return jsonify({"error": "Mensaje vacío o incorrecto."}), 400

        #Extraemos el mensaje del usuario
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
            return jsonify({"response": str(e)})

        # Obtener la mejor ruta de transporte público
        ruta = obtener_ruta_transporte(origen, destino, gmaps)
        print("Rutaaa!!!!!!")
        print(ruta)

        # Generar respuesta con OpenAI
        
        prompt = f"""
        Traduce las siguientes indicaciones al español y da un formato agradable, quita los saltos de línea innecesarios, mantén los emojis y elimina los asteriscos innecesarios para que se pueda visualizar de una manera agradable:
        {chr(10).join(ruta)}
        """

        response = openai_client.chat.completions.create(
            model="gpt-4-turbo",
            messages=[
                {"role": "system", "content": "Eres un asistente de navegación que da instrucciones claras y naturales."},
                {"role": "user", "content": prompt}
            ]
        )

        #Extraemos la respuesta de openai y mandamos en formato json
        bot_response = response.choices[0].message.content
        return jsonify({"response": bot_response})

    except Exception as e:
        print(f"❌ Error en el backend: {e}")
        return jsonify({"error": "Error interno del servidor."}), 500



@chatbot_routes.route("/imagen", methods=["POST"])
def imagen():
    try:
        if not request.is_json:
            return jsonify({"error": "Solicitud inválida. Asegúrate de enviar un JSON."}), 400

        data = request.get_json()
        print(f"📥 Datos recibidos en Flask: {data}")

        if "message" not in data or not data["message"]:
            return jsonify({"error": "Mensaje vacío o incorrecto."}), 400

        #Extraemos el mensaje del usuario
        user_message = data["message"]

        # Obtener la API Key desde Flask
        openai_api_key = current_app.config.get("OPENAI_API_KEY")

        if not openai_api_key:
            return jsonify({"error": "Falta las API Key de OpenAI en la configuración."}), 500

        # Inicializar clientes de OpenAI y Google Maps
        openai_client = openai.OpenAI(api_key=openai_api_key)

        prompt = f"""
        El siguiente mensaje contiene un código de bus, dicho código pueden ser números o letras o una combinación de ambos, por ejemplo "66", "E1", "IN01". Si no logras identificar dicho código tu respuesta debe ser el número 1000. Si logras identificar el código responde únicamente con el código. Mensaje:
        {chr(10).join(user_message)}
        """

        response = openai_client.chat.completions.create(
            model="gpt-4-turbo",
            messages=[
                {"role": "system", "content": "Eres un asistente que identifica códigos alfanuméricos de buses."},
                {"role": "user", "content": prompt}
            ]
        )
        id_bus = response.choices[0].message.content
        print("Id!!!!!!!!!!!!!!!!!!!!!")
        print(id_bus)

        if id_bus == "1000":
            return jsonify({"response": "No pude identificar el bus que estás solicitando, asegúrate de escribir bien el código del bus."})
        
        # Buscamos el id en del data frame (la columna se llama linea en el excel) pero primero convertimos esa columna del dataframe en string y hacemos lo mismo para el id extraido del mensaje
        resultado = df_buses[df_buses["linea"].astype(str) == str(id_bus)]

        if resultado.empty:
            return jsonify({"response": "No encontré información sobre ese bus, asegúrate de escribir bien el código del bus."})
        
        # Obtenemos el link de la imagen (suponiendo que la columna se llama 'imagen')
        link_imagen = resultado.iloc[0]["imagen"] 
        print("Link de la imagen!!!!!!!!!!")
        print(link_imagen)

        return jsonify({"response": link_imagen})
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
            departure_time="now",  # Tráfico en tiempo real
            #alternatives=True  # Pedimos múltiples opciones
            region="ec"
        )

        if not rutas:
            return "❌ No se encontraron rutas de transporte público disponibles."

        # Ordenamos por la duración en segundos y elegimos la más rápida
        ruta_mas_corta = min(rutas, key=lambda r: r["legs"][0]["duration"]["value"])
        duracion_total = ruta_mas_corta["legs"][0]["duration"]["text"]

        print(f"✅ Mejor ruta seleccionada: {duracion_total}")

        # Obtener paradas reales cercanas al origen y destino
        #paradas_origen = obtener_paradas_reales(origen, destino)
        #paradas_destino = obtener_paradas_reales(destino, origen)

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

        return (
            #f"🕒 **Tiempo estimado:** {duracion_total}\n\n"
            #f"🚌 **Paradas cercanas al origen:** {', '.join(paradas_origen)}\n"
            #f"🏁 **Paradas cercanas al destino:** {', '.join(paradas_destino)}\n\n"
            #+ "\n".join(pasos)
            "\n".join(pasos)
        )

    except Exception as e:
        return f"❌ Error al obtener la ruta: {str(e)}"