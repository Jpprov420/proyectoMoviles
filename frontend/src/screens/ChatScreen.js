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
      <View style={styles.contenedorBarraNavegacion}>
        <TouchableOpacity style={styles.itemsBarraNavegacion}>
          <Text style={{ textAlign: "center" }}>Acerca de Nosotros</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.itemsBarraNavegacion}>
          <Text style={{ textAlign: "center" }}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.itemsBarraNavegacion}>
          <Text style={{ textAlign: "center" }}>Perfil</Text>
        </TouchableOpacity>
      </View>
      {/* Botón de perfil en la parte superior derecha */}
      <TouchableOpacity 
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 10,
          backgroundColor: "#6A5ACD",
          padding: 10,
          borderRadius: 50,
        }}
        onPress={() => navigation.replace("Profile")}
      >
        <Icon name="account-circle" size={30} color="#FFF" />
      </TouchableOpacity>

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
  },
  itemsBarraNavegacion: {
    width: "33%",
    backgroundColor: "#e3e3e3",
    borderWidth: 1,
    border: 10,
    padding: 10,
    
  }
});

export default ChatScreen;
