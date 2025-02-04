import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ChatBubble = ({ text, isUser }) => {
  return (
    <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  bubble: {
    padding: 10,
    margin: 5,
    borderRadius: 10,
    maxWidth: "80%",
  },
  userBubble: {
    backgroundColor: "#007AFF",
    alignSelf: "flex-end",
  },
  botBubble: {
    backgroundColor: "#E5E5EA",
    alignSelf: "flex-start",
  },
  text: {
    color: "#000",
  },
});

export default ChatBubble;
