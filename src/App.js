// src/App.jsx
import * as React from "react";
import { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

// Importar pantallas de autenticación
import Login from "./pages/Login";
import Register from "./pages/Register";

// Importar pantallas del sistema principal
import PerfilPage from "./pages/PerfilPage";
import EditarPerfilPage from "./pages/EditarPerfilPage";
import DetallePublicacionPage from "./pages/DetallePublicacionPage";

// Pantallas placeholder
const HomePage = () => (
  <View style={styles.center}><Text>Inicio</Text></View>
);
const ExplorarPage = () => (
  <View style={styles.center}><Text>Explorar</Text></View>
);
const CrearPage = () => (
  <View style={styles.center}><Text>Crear Post</Text></View>
);
const NotificacionesPage = () => (
  <View style={styles.center}><Text>Notificaciones</Text></View>
);

// --- NAVIGATORS ---
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// --- PERFIL STACK ---
const PerfilStack = () => (
  <Stack.Navigator screenOptions={styles.stackOptions}>
    <Stack.Screen name="Perfil" component={PerfilPage} options={{ title: "Mi Perfil" }} />
    <Stack.Screen name="EditarPerfil" component={EditarPerfilPage} options={{ title: "Editar Información" }} />
    <Stack.Screen name="DetallePublicacion" component={DetallePublicacionPage} options={{ title: "Publicación" }} />
  </Stack.Navigator>
);

// --- MAIN TABS ---
const MainTabs = () => (
  <Tab.Navigator
    initialRouteName="Inicio"
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: "#4CAF50",
      tabBarInactiveTintColor: "gray",
      tabBarIcon: ({ color, size }) => {
        let iconName;
        switch (route.name) {
          case "Inicio": iconName = "home-outline"; break;
          case "Explorar": iconName = "search-outline"; break;
          case "Crear": iconName = "add-circle-outline"; break;
          case "Notificaciones": iconName = "notifications-outline"; break;
          case "Mi Cuenta": iconName = "person-outline"; break;
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Inicio" component={HomePage} />
    <Tab.Screen name="Explorar" component={ExplorarPage} />
    <Tab.Screen name="Crear" component={CrearPage} />
    <Tab.Screen name="Notificaciones" component={NotificacionesPage} />
    <Tab.Screen name="Mi Cuenta" component={PerfilStack} options={{ title: "Perfil" }} />
  </Tab.Navigator>
);

// --- AUTH STACK (Login / Register) ---
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Register" component={Register} />
  </Stack.Navigator>
);

// --- APP PRINCIPAL ---
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      const user = await AsyncStorage.getItem('currentUser');
      setIsAuthenticated(!!user);
      setLoading(false);
    };
    checkLogin();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="AuthStack" component={AuthStack} />
          </>
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};


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

export default App;


// NOTA: Recuerda crear los archivos placeholder en src/pages/
// (Ej. EditarPerfilPage.jsx) para que el código compile, aunque estén vacíos.
