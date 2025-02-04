import React, { useState, useCallback, useEffect } from "react";
import { View, Platform } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { sendMessageToChatbot } from "../api/chatbotService";

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);

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

  const onSend = useCallback(async (newMessages = []) => {
    setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));

    const userMessage = newMessages[0];
    const botResponse = await sendMessageToChatbot(userMessage.text);

    const botMessage = {
      _id: Math.random().toString(),
      text: botResponse,
      createdAt: new Date(),
      user: { _id: 2, name: "Chatbot" },
    };

    setMessages((prevMessages) => GiftedChat.append(prevMessages, [botMessage]));
  }, []);

  return (
    <View style={{ flex: 1, paddingBottom: Platform.OS === "ios" ? 20 : 0 }}>
      <GiftedChat messages={messages} onSend={(messages) => onSend(messages)} user={{ _id: 1 }} />
    </View>
  );
};

export default ChatScreen;
