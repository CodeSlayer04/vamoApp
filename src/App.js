import * as React from "react";
import { View, Text, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";


import { db } from '../src/config/firebaseconfig';


import InicioPage from "./pages/InicioPage";
import PerfilPage from "./pages/PerfilPage";
import EditarPerfilPage from "./pages/EditarPerfilPage";
import DetallePublicacionPage from "./pages/DetallePublicacionPage";
import CercaDeMiPage from "./pages/CercaDeMiPage";
import MapaCategoriaPage from "./pages/MapaCategoriaPage";
import CategoriaHomePage from "./pages/CategoriaHomePage";
import InformacionCategoriaPage from "./pages/InformacionCategoriaPage";
import CrearPage from "./pages/CrearPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PerfilOtroUsuarioPage from "./pages/PerfilOtroUsuarioPage"; 
import NotificacionesScreen from "./pages/NotificacionesScreen";
import EditarPublicacionPage from "./pages/EditarPublicacionPage";


const NotificacionesPage = () => (
  <View style={styles.center}>
    <Text>Notificaciones</Text>
  </View>
);


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const ExplorarStackNav = createNativeStackNavigator();
const HomeStackNav = createNativeStackNavigator(); 

const HomeStack = () => (
    <HomeStackNav.Navigator screenOptions={styles.stackOptions}>
        <HomeStackNav.Screen
            name="InicioTab" 
            component={InicioPage}
            options={{ title: "Inicio" }}
        />
        <HomeStackNav.Screen
            name="PerfilOtroUsuarioPage"
            component={PerfilOtroUsuarioPage}
            options={{ title: "Perfil de Usuario" }}
        />
    </HomeStackNav.Navigator>
);


const ExplorarStack = () => (
  <ExplorarStackNav.Navigator screenOptions={styles.stackOptions}>
    <ExplorarStackNav.Screen
      name="CercaDeMi"
      component={CercaDeMiPage}
      options={{ title: "Explorar" }}
    />
    <ExplorarStackNav.Screen
      name="CategoriaHome"
      component={CategoriaHomePage}
      options={({ route }) => ({ title: route.params?.categoria || "Categoría" })}
    />
    <ExplorarStackNav.Screen
      name="InformacionCategoria"
      component={InformacionCategoriaPage}
      options={({ route }) => ({ title: route.params?.categoria || "Información" })}
    />
    <ExplorarStackNav.Screen
      name="MapaCategoria"
      component={MapaCategoriaPage}
      options={({ route }) => ({ title: route.params?.categoria || "Mapa" })}
    />
  </ExplorarStackNav.Navigator>
);


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
      name="EditarPerfilPage"
      component={EditarPerfilPage}
      options={{ title: "Editar Información" }}
    />
    
    <Stack.Screen
      name="DetallePublicacionPage"
      component={DetallePublicacionPage}
      options={{ title: "Publicación" }}
    />

    
    <Stack.Screen
        name="PerfilOtroUsuarioPage"
        component={PerfilOtroUsuarioPage}
        options={{ title: "Perfil de Usuario" }}
    />

    <Stack.Screen 
    name="EditarPublicacionPage"
    component={EditarPublicacionPage}
    />
    
  </Stack.Navigator>
);


const MainTabs = () => (
  <Tab.Navigator
    initialRouteName="InicioStack"
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: "#4CAF50",
      tabBarInactiveTintColor: "gray",
      tabBarIcon: ({ color, size }) => {
        let iconName;
        switch (route.name) {
          case "InicioStack":
            iconName = "home-outline";
            break;
          case "Explorar":
            iconName = "compass-outline";
            break;
          case "Crear":
            iconName = "add-circle-outline";
            break;
          case "Notificaciones":
            iconName = "notifications-outline";
            break;
          case "Mi Cuenta":
            iconName = "person-outline";
            break;
          default:
            iconName = "ellipse";
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="InicioStack" component={HomeStack} options={{ title: "Inicio" }} />
    <Tab.Screen name="Explorar" component={ExplorarStack} />
    <Tab.Screen name="Crear" component={CrearPage} />
    <Tab.Screen name="Notificaciones" component={NotificacionesScreen} />
    <Tab.Screen
      name="Mi Cuenta"
      component={PerfilStack}
      options={{ title: "Perfil" }}
    />
  </Tab.Navigator>
);



const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Register" component={Register} />
    <Stack.Screen name="MainTabs" component={MainTabs} />
    <Stack.Screen
      name="DetallePublicacion"
      component={DetallePublicacionPage}
      options={{ headerShown: true, title: "Publicación" }}
    />
  </Stack.Navigator>
);



export default function App() {
  return (
    <NavigationContainer>
      <AuthStack />
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
