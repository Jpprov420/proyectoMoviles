import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";

const NavigationBar = () => {
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <View style={styles.container}>
      {/* Texto a la izquierda */}
      <Text style={styles.title}>Movilízate UIO!</Text>

      {/* Botones con íconos a la derecha */}
      <View style={styles.iconContainer}>
        <TouchableOpacity
          style={[styles.tabButton, route.name === "About" && styles.activeTab]}
          onPress={() => navigation.replace("About")}
        >
          <FontAwesome 
            name="info-circle" 
            size={22} 
            color={route.name === "About" ? "#1e4188" : "#333"} 
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, route.name === "Chat" && styles.activeTab]}
          onPress={() => navigation.replace("Chat")}
        >
          <FontAwesome 
            name="comments" 
            size={22} 
            color={route.name === "Chat" ? "#1e4188" : "#333"} 
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, route.name === "Profile" && styles.activeTab]}
          onPress={() => navigation.replace("Profile")}
        >
          <FontAwesome 
            name="user-circle" 
            size={22} 
            color={route.name === "Profile" ? "#1e4188" : "#333"} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#FFF",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  iconContainer: {
    flexDirection: "row",
  },
  tabButton: {
    marginHorizontal: 10,
  },
  activeTab: {
    backgroundColor: "transparent",
  },
});

export default NavigationBar;
