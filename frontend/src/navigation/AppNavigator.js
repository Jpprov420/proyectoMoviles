import React from "react";
import { StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import ChatScreen from "../screens/ChatScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ProfileScreen from '../screens/PerfilScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ title: "Login", headerTitleAlign: 'center' }}
        />

        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ title: "Registro", headerTitleAlign: 'center'}} 
        />

        <Stack.Screen
          name="Profile"
          component={ProfileScreen} 
          options={{ title: "Perfil", headerTitleAlign: 'center' }}
        />

        <Stack.Screen 
          name="Chat" 
          component={ChatScreen} 
          options={{ title: "Chat de Rutas", headerTitleAlign: 'center' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
  

export default AppNavigator;
