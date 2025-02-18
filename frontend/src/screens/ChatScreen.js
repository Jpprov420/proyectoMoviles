import React, { useState, useCallback, useEffect } from "react";
import { View, Platform, TouchableOpacity, Text, StyleSheet } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { sendMessageToChatbot } from "../api/chatbotService";

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "Hola 👋 ¿Cómo puedo ayudarte con las rutas de buses?",
        createdAt: new Date(),
        user: { _id: 2, name: "Chatbot" },
      },
    ]);
  }, []);

  //usamos el hook useCallback para optimizar el rendimiento al renderizar constantemente el chat cada que se envían y reciben mensajes nuevos, por lo tanto la función onSend solo se creará una vez y se memorizará para cada render
  const onSend = useCallback(async (newMessages = []) => {
    setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));

    const userMessage = newMessages[0];//contiene el mensaje que estamos enviando
    const botResponse = await sendMessageToChatbot(userMessage.text);//usamos la propiedad text de ese objeto

    // Detectar si la respuesta es una URL de imagen
    const isImage = typeof botResponse === "string" && botResponse.startsWith("http");

    //creamos la estructura del objeto mensaje a partir del texto o imagen que devolvió la api
    const botMessage = {
      _id: Math.random().toString(),
      createdAt: new Date(),
      user: { _id: 2, name: "Chatbot" },
      ...(isImage
        ? { image: botResponse } // Si es una imagen, usa la propiedad image
        : { text: botResponse }), // Si no, usa text
    };

    setMessages((prevMessages) => GiftedChat.append(prevMessages, [botMessage]));
  }, []);

  return (
    <View style={{ flex: 1, paddingBottom: Platform.OS === "ios" ? 20 : 0 }}>

      <GiftedChat 
        messages={messages} 
        onSend={(messages) => onSend(messages)} 
        user={{ _id: 1 }} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  contenedorBarraNavegacion: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#F0F0F0",
    paddingVertical: 5,
    borderTopWidth: 2,
    borderTopColor: "#CCC",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  itemsBarraNavegacion: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E3E3E3",
    borderRadius: 10,
    marginHorizontal: 5,
  },
  pestañaActiva: {
    backgroundColor: "#6A5ACD",
    borderBottomWidth: 4,
    borderBottomColor: "#4B0082",
    transform: [{ scaleY: 0.95 }],
    shadowColor: "#6A5ACD",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  textoPestaña: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 14,
  },
  textoActivo: {
    color: "#FFF",
  },
});

export default ChatScreen;
