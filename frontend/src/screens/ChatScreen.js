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

  const onSend = useCallback(async (newMessages = []) => {
    setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));

    const userMessage = newMessages[0];
    const botResponse = await sendMessageToChatbot(userMessage.text);

    const botMessage = {
      _id: Math.random().toString(),
      text: botResponse,
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
