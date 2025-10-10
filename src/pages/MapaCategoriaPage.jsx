// src/App.js
import * as React from "react";
import { View, Text, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

// Rutas relativas CORRECTAS (desde src/App.js -> ./pages/...)
import PerfilPage from "./PerfilPage";
import EditarPerfilPage from "./EditarPerfilPage";
import DetallePublicacionPage from "./DetallePublicacionPage";
import CercaDeMiPage from "./CercaDeMiPage";
import MapaCategoriaPage from "./MapaCategoriaPage.jsx";

// Placeholders inline (evitan errores si no tienes archivos para estas pantallas)
const HomePage = () => (
  <View style={styles.center}>
    <Text>Inicio</Text>
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

// Navigators
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const ExplorarStackNav = createNativeStackNavigator();

// Stack anidado para Explorar (CercaDeMi -> MapaCategoria)
const ExplorarStack = () => (
  <ExplorarStackNav.Navigator screenOptions={styles.stackOptions}>
    <ExplorarStackNav.Screen
      name="CercaDeMi"
      component={CercaDeMiPage}
      options={{ title: "Explorar" }}
    />
    <ExplorarStackNav.Screen
      name="MapaCategoria"
      component={MapaCategoriaPage}
      options={({ route }) => ({ title: route.params?.categoria || "Mapa" })}
    />
  </ExplorarStackNav.Navigator>
);

// Stack para Perfil (ya lo tenías)
const PerfilStack = () => (
  <Stack.Navigator initialRouteName="Perfil" screenOptions={styles.stackOptions}>
    <Stack.Screen name="Perfil" component={PerfilPage} options={{ title: "Mi Perfil" }} />
    <Stack.Screen name="EditarPerfil" component={EditarPerfilPage} options={{ title: "Editar Información" }} />
    <Stack.Screen name="DetallePublicacion" component={DetallePublicacionPage} options={{ title: "Publicación" }} />
  </Stack.Navigator>
);

// Tab Navigator principal
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Inicio"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: "#4CAF50",
          tabBarInactiveTintColor: "gray",
          tabBarIcon: ({ color, size }) => {
            let iconName = "ellipse";
            if (route.name === "Inicio") iconName = "home-outline";
            else if (route.name === "Explorar") iconName = "compass-outline";
            else if (route.name === "Crear") iconName = "add-circle-outline";
            else if (route.name === "Notificaciones") iconName = "notifications-outline";
            else if (route.name === "Mi Cuenta") iconName = "person-outline";
            return <Ionicons name={iconName} size={24} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Inicio" component={HomePage} />
        <Tab.Screen name="Explorar" component={ExplorarStack} />
        <Tab.Screen name="Crear" component={CrearPage} />
        <Tab.Screen name="Notificaciones" component={NotificacionesPage} />
        <Tab.Screen name="Mi Cuenta" component={PerfilStack} options={{ title: "Perfil" }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  stackOptions: {
    headerStyle: { backgroundColor: "#4CAF50" },
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
