import axios from "axios";
import { API_URL } from "../config";

export const sendMessageToChatbot = async (message) => {
  try {
    console.log(`📡 Enviando mensaje al backend: ${message}`);

    const response = await axios.post(`${API_URL}/chat`, 
      JSON.stringify({ message }), // 👈 Asegurarse de enviar un JSON válido
      { headers: { "Content-Type": "application/json" } } // 👈 Agregar el Content-Type
    );

    console.log("✅ Respuesta del backend:", response.data);
    return response.data.response;
  } catch (error) {  //Manejo de errores
    console.error("❌ Error en la solicitud:", error);
    return "Hubo un error al procesar tu solicitud.";
  }
};
