import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import ChatScreen from "../screens/ChatScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ProfileScreen from '../screens/PerfilScreen';
import NavigationBar from "../components/NavigationBar";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ }}
        />

        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ title: "Registro", headerTitleAlign: 'center'}} 
        />

        <Stack.Screen
          name="Profile"
          component={ProfileScreen} 
          options={{ header: () => <NavigationBar/> }}
        />

        <Stack.Screen 
          name="Chat" 
          component={ChatScreen} 
          options={{header: () => <NavigationBar />}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
