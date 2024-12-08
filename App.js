import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AuthScreen from "./src/screens/AuthScreen";
import TransacaoListScreen from "./src/screens/TransacaoListScreen";
import TransacaoFormScreen from "./src/screens/TransacaoFormScreen";
import { TransacaoProvider } from "./src/context/TransacaoContext";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <TransacaoProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Autenticação">
            <Stack.Screen name="Autenticação" component={AuthScreen} />
            <Stack.Screen name="Transações" component={TransacaoListScreen} />
            <Stack.Screen name="Cadastrar Transação" component={TransacaoFormScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </TransacaoProvider>
  );
}
