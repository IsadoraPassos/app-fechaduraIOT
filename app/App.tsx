import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./components/LoginScreen";
import HomeScreen from "./components/HomeScreen";
import CreatePasswordScreen from "./components/CreatePasswordScreen";
import PasswordListScreen from "./components/PasswordListScreen";
import { Provider as PaperProvider } from "react-native-paper";
import { useEffect } from "react";
import { initDatabase } from "./db/database";


const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
  initDatabase().catch(console.error);
  }, []);

  return (
    <PaperProvider>
    
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Nova Senha" component={CreatePasswordScreen} />
          <Stack.Screen name="Lista de Senhas" component={PasswordListScreen} />
        </Stack.Navigator>
      
    </PaperProvider>
  );
}

