import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import ChatScreen from "../screens/ChatScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ 
            title: "Login", 
            headerTitleAlign: 'center' // Centra el título de la pantalla Login
          }}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ 
            title: "Register", 
            headerTitleAlign: 'center' // Centra el título de la pantalla Register
          }} 
        />
        <Stack.Screen 
          name="Chat" 
          component={ChatScreen} 
          options={{
            title: "Chat de Rutas",
            headerTitleAlign: 'center' // Centra el título horizontalmente
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
