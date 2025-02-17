import googlemaps
import os
import openai
import json

# Obtener API Key desde Flask
google_maps_api_key = os.getenv("GOOGLE_MAPS_API_KEY")
gmaps = googlemaps.Client(key=google_maps_api_key)
openai_api_key = os.getenv("OPENAI_API_KEY")
openai_client = openai.OpenAI(api_key=openai_api_key)


def analizar_mensaje_con_openai(mensaje):
    """
    Usa OpenAI GPT para extraer el origen y destino del mensaje del usuario.
    """
    prompt = f"""
    Extrae el origen y destino de este mensaje del usuario. 
    Si no está claro, devuelve "desconocido" para el origen o destino.

    Mensaje: "{mensaje}"

    Responde en formato JSON: {{"origen": "lugar de origen", "destino": "lugar de destino"}}
    """

    try:
        response = openai_client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "system", "content": "Eres un asistente experto en geolocalización."},
                      {"role": "user", "content": prompt}]
        )

        resultado = response.choices[0].message.content
        return json.loads(resultado)  # Convertir el JSON a diccionario

    except Exception as e:
        print(f"Error en OpenAI: {e}")
        return {"origen": "desconocido", "destino": "desconocido"}



def validar_con_google_maps(lugar):
    """
    Valida un lugar con Google Maps Geocoding y devuelve su dirección formateada.
    """
    if lugar.lower() == "desconocido":
        return None
    
    try:
        # Primero intentamos buscar el lugar exacto con Places API
        places_result = gmaps.places(query=lugar, location=(-0.22985, -78.52495), radius=500)#Radio más preciso
        if places_result.get("results"):
            best_match = places_result["results"][0]  # Tomamos el mejor resultado
            place_id = best_match["place_id"]
            
            # 📍 Obtenemos detalles del lugar exacto
            place_details = gmaps.place(place_id=place_id)
            if place_details.get("result"):
                return place_details["result"]["formatted_address"]
        # 📌 Si no encontramos con Places, intentamos con Geocoding
        geocode_result = gmaps.geocode(lugar, components={"country": "EC"})
        if geocode_result:
            return geocode_result[0]["formatted_address"]
        # ❌ No se encontró nada
        print(f"⚠️ No se encontró una ubicación precisa para '{lugar}'")
        return None
    except Exception as e:
        print(f"❌ Error en Google Maps: {e}")
        return None


def extraer_lugares(mensaje):
    """
    Detecta origen y destino en un mensaje del usuario usando OpenAI y valida con Google Maps.
    """
    # Paso 1: OpenAI extrae posibles lugares
    lugares = analizar_mensaje_con_openai(mensaje)
    origen = validar_con_google_maps(lugares["origen"])
    destino = validar_con_google_maps(lugares["destino"])

    # Si no hay origen o destino, asignamos valores por defecto
    if not origen and not destino:
        raise ValueError("No pude identificar lugares en tu pregunta.")
    if not origen:
        origen = "Terminal Quitumbe, Quito"
    if not destino:
        destino = "Terminal Quitumbe, Quito"

    print(f"📌 Origen detectado: {origen}")
    print(f"📌 Destino detectado: {destino}")
    
    return origen, destino

# def extraer_lugares(mensaje):
#     """
#     Usa Google Geocoding API para detectar ubicaciones en una consulta del usuario.
#     """


#     #lugares = []
#     #palabras = mensaje.split()  # Divide la oración en palabras


#     #for palabra in palabras:
#        #result = gmaps.places_autocomplete(palabra)  # Autocompleta basado en Google Places
#        #if result:
#            #lugar_info = gmaps.geocode(result[0]['description'])  # Geocodificación precisa
#            #if lugar_info:
#                #lugares.append(lugar_info[0]['formatted_address'])  # Dirección completa

#     print(f"📌 Lugares detectados: {lugares}")
    
#     if len(lugares) >= 2:
#         return lugares[0], lugares[1]
#     elif len(lugares) == 1:
#         return lugares[0], "Terminal Quitumbe, Quito"  # Punto de referencia si solo hay un lugar
#     else:
#         raise ValueError("No pude identificar lugares en tu pregunta.")

# def obtener_paradas_reales(origen, destino):
#     """
#     Busca las paradas de bus reales cercanas a la ruta más corta.
#     """
#     try:
#         resultados = gmaps.places_nearby(
#             location=origen,
#             radius=500,  # Busca en un radio de 500m
#             type="transit_station"  # Solo estaciones de bus
#         )

#         paradas = [parada["name"] for parada in resultados.get("results", [])]
#         return paradas if paradas else ["No se encontraron paradas cercanas."]
#     except Exception as e:
#         return [f"Error al obtener paradas: {str(e)}"]
