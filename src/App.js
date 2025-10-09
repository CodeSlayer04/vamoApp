// src/App.jsx (Router Central con Bottom Tabs)

import * as React from "react";
import { View, Text, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"; // <-- NUEVO

// Importar Pantallas
import PerfilPage from "./pages/PerfilPage";
import EditarPerfilPage from "./pages/EditarPerfilPage";
import DetallePublicacionPage from "./pages/DetallePublicacionPage";
// Placeholder para otras pantallas (deben existir los archivos en src/pages/)
const HomePage = () => (
  <View style={styles.center}>
    <Text>Inicio</Text>
  </View>
);
const ExplorarPage = () => (
  <View style={styles.center}>
    <Text>Explorar</Text>
  </View>
);
const CrearPage = () => (
  <View style={styles.center}>
    <Text>Crear Post</Text>
  </View>
);
const NotificacionesPage = () => (
  <View style={styles.center}>
    <Text>Notificaciones</Text>
  </View>
);

// 1. Creación de Navigators
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// --- SUB-ROUTER: STACK DE PERFIL (Maneja Perfil, Editar y Detalle) ---
const PerfilStack = () => (
  <Stack.Navigator
    initialRouteName="Perfil"
    screenOptions={styles.stackOptions}
  >
    <Stack.Screen
      name="Perfil"
      component={PerfilPage}
      options={{ title: "Mi Perfil" }}
    />
    <Stack.Screen
      name="EditarPerfil"
      component={EditarPerfilPage}
      options={{ title: "Editar Información" }}
    />
    <Stack.Screen
      name="DetallePublicacion"
      component={DetallePublicacionPage}
      options={{ title: "Publicación" }}
    />
  </Stack.Navigator>
);

// --- ROUTER PRINCIPAL: BOTTOM TABS ---
const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Inicio"
        screenOptions={({ route }) => ({
          headerShown: false, // Ocultamos el header para que lo controle el Stack interno
          tabBarActiveTintColor: "#4CAF50", // Verde de Vamo
          tabBarInactiveTintColor: "gray",
          // texto con iconos 
          tabBarIcon: ({ color, size }) => {
            let iconName = "";
            if (route.name === "Inicio") iconName = "🏠";
            else if (route.name === "Explorar") iconName = "🔍";
            else if (route.name === "Crear") iconName = "➕";
            else if (route.name === "Notificaciones") iconName = "🔔";
            else if (route.name === "Mi Cuenta") iconName = "👤";
            return <Text style={{ color, fontSize: size }}>{iconName}</Text>;
          },
        })}
        //Opciones de navegación
      >
        <Tab.Screen name="Inicio" component={HomePage} />
        <Tab.Screen name="Explorar" component={ExplorarPage} />
        <Tab.Screen name="Crear" component={CrearPage} />
        <Tab.Screen name="Notificaciones" component={NotificacionesPage} />

        {/* Panta Perfil */}
        <Tab.Screen
          name="Mi Cuenta"
          component={PerfilStack}
          options={{ title: "Perfil" }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  stackOptions: {
    headerStyle: { backgroundColor: "#4CAF50" }, // Color primario de Vamo
    headerTintColor: "#fff",
    headerTitleStyle: { fontWeight: "bold" },
    headerBackTitleVisible: false,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default App;

// NOTA: Recuerda crear los archivos placeholder en src/pages/
// (Ej. EditarPerfilPage.jsx) para que el código compile, aunque estén vacíos.
