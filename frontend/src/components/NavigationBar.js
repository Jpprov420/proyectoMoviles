import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

const NavigationBar = () => {
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.tabButton,
          route.name === "About" && styles.activeTab,
        ]}
        onPress={() => navigation.replace("About")}
      >
        <Text style={[styles.tabText, route.name === "About" && styles.activeText]}>
          Acerca de
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.tabButton,
          route.name === "Chat" && styles.activeTab,
        ]}
        onPress={() => navigation.replace("Chat")}
      >
        <Text style={[styles.tabText, route.name === "Chat" && styles.activeText]}>
          Chat
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.tabButton,
          route.name === "Profile" && styles.activeTab,
        ]}
        onPress={() => navigation.replace("Profile")}
      >
        <Text style={[styles.tabText, route.name === "Profile" && styles.activeText]}>
          Perfil
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "auto",
    flexDirection: "row",
    backgroundColor: "#ddd",
    justifyContent: "space-around",
    alignItems: "center",
    elevation: 5, // Sombra en Android
    shadowColor: "#000", // Sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    paddingVertical: 20,
    alignItems: "center",
    backgroundColor: "#6A5ACD",
    height: "auto"
  },
  activeTab: {
    backgroundColor: "rgb(120, 100, 250)", // Color diferente cuando está seleccionado
    borderRightWidth:1,
    borderLeftWidth: 1,
    borderColor: "#3a3a3a",
    shadowColor: "#000",
    elevation: 5,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  activeText: {
    color: "#FFF", // Texto en blanco cuando está seleccionado
  },
});

export default NavigationBar;