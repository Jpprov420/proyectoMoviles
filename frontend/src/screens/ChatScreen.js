import React, { useState, useCallback, useEffect } from "react";
import { View, Platform, Image, StyleSheet } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { useNavigation } from "@react-navigation/native";
import { sendMessageToChatbot } from "../api/chatbotService";
import ChatBubble from "../components/ChatBubble"; // Importa la burbuja personalizada

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "Hola soy Pikito👋 ¿Cómo puedo ayudarte con las rutas de buses?",
        createdAt: new Date(),
        user: { 
          _id: 2, 
          name: "Chatbot",
          avatar: require("../../assets/pikito.png"), 
        },
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
      user: { 
        _id: 2, 
        name: "Chatbot",
        avatar: require("../../assets/pikito.png"), 
      },
    };

    setMessages((prevMessages) => GiftedChat.append(prevMessages, [botMessage]));
  }, []);

  const renderAvatar = (props) => {
    return (
      <Image
        source={props.currentMessage.user.avatar}
        style={styles.avatar}
      />
    );
  };

  return (
    <View style={{ flex: 1, paddingBottom: Platform.OS === "ios" ? 20 : 0 }}>
      <GiftedChat 
        messages={messages} 
        onSend={(messages) => onSend(messages)} 
        user={{ _id: 1 }} 
        renderBubble={(props) => <ChatBubble {...props} />} 
        renderAvatar={renderAvatar} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 0, 
    resizeMode: "contain", 
  },
});

export default ChatScreen;
