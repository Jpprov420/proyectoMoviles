import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Bubble } from "react-native-gifted-chat";

const ChatBubble = (props) => {
  return (
    <Bubble
      {...props}
      wrapperStyle={{
        right: styles.userBubble,
        left: styles.botBubble,
      }}
      textStyle={{
        right: styles.textRight,
        left: styles.textLeft,
      }}
    />
  );
};

const styles = StyleSheet.create({
  userBubble: {
    backgroundColor: "#c23e3e",
  },
  botBubble: {
    backgroundColor: "#E5E5EA",
  },
  textRight: {
    color: "#fff",
  },
  textLeft: {
    color: "#000",
  },
});

export default ChatBubble;
