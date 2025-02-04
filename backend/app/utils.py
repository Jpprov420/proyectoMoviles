import googlemaps
import os

# Obtener API Key desde Flask
google_maps_api_key = os.getenv("GOOGLE_MAPS_API_KEY")
gmaps = googlemaps.Client(key=google_maps_api_key)

def extraer_lugares(mensaje):
    """
    Usa Google Geocoding API para detectar ubicaciones en una consulta del usuario.
    """
    lugares = []
    palabras = mensaje.split()  # Divide la oración en palabras

    for palabra in palabras:
        result = gmaps.places_autocomplete(palabra)  # Autocompleta basado en Google Places
        if result:
            lugar_info = gmaps.geocode(result[0]['description'])  # Geocodificación precisa
            if lugar_info:
                lugares.append(lugar_info[0]['formatted_address'])  # Dirección completa

    print(f"📌 Lugares detectados: {lugares}")
    
    if len(lugares) >= 2:
        return lugares[0], lugares[1]
    elif len(lugares) == 1:
        return lugares[0], "Terminal Quitumbe, Quito"  # Punto de referencia si solo hay un lugar
    else:
        raise ValueError("No pude identificar lugares en tu pregunta.")

def obtener_paradas_reales(origen, destino):
    """
    Busca las paradas de bus reales cercanas a la ruta más corta.
    """
    try:
        resultados = gmaps.places_nearby(
            location=origen,
            radius=500,  # Busca en un radio de 500m
            type="transit_station"  # Solo estaciones de bus
        )

        paradas = [parada["name"] for parada in resultados.get("results", [])]
        return paradas if paradas else ["No se encontraron paradas cercanas."]
    except Exception as e:
        return [f"Error al obtener paradas: {str(e)}"]
