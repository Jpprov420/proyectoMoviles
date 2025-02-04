import googlemaps
import os

# Obtener API Key desde Flask
google_maps_api_key = os.getenv("GOOGLE_MAPS_API_KEY")
gmaps = googlemaps.Client(key=google_maps_api_key)

def extraer_lugares(mensaje):
    """
    Usa Google Places API para detectar ubicaciones en una consulta del usuario.
    """
    lugares = []
    palabras = mensaje.split()  # Divide la oración en palabras

    for palabra in palabras:
        result = gmaps.geocode(palabra)  # Usamos geocodificación en vez de autocomplete
        if result:
            lugares.append(result[0]['formatted_address'])  # Extrae la dirección completa

    print(f"📌 Lugares detectados: {lugares}")
    if len(lugares) >= 2:
        return lugares[0], lugares[1]
    elif len(lugares) == 1:
        return lugares[0], "Terminal Quitumbe, Quito"
    else:
        raise ValueError("No pude identificar lugares en tu pregunta.")
