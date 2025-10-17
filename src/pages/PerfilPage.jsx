// src/pages/PerfilPage.jsx

import React from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

// 🛑 CLAVE: Importar la instancia de autenticación para obtener el ID real
import { auth } from "../config/firebaseconfig";

import { useObtenerPerfilUsuario } from "../hooks/useObtenerPerfilUsuario";
import EncabezadoPerfil from "../components/EncabezadoPerfil";
import ListaPublicacionesUsuario from "../components/ListaPublicacionesUsuario";

const PerfilPage = ({ navigation }) => {
  // Obtener el ID del usuario logueado (uid de Firebase Auth)
  const userId = auth.currentUser ? auth.currentUser.uid : null;

  // Manejo de la No-Autenticación
  if (!userId) {
    return (
      <View style={styles.centro}>
        <Text style={styles.textoError}>
          No estás autenticado. Por favor, inicia sesión.
        </Text>
        <Text
          onPress={() => navigation.navigate("Login")}
          style={styles.linkLogin}
        >
          Ir a Iniciar Sesión
        </Text>
      </View>
    );
  }

  // Usar el hook con el UID real
  const { datosPerfil, estaCargando, error } = useObtenerPerfilUsuario(userId);

  // Manejo de la Carga
  if (estaCargando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text>Cargando perfil...</Text>
      </View>
    );
  }

  // Manejo del Error (Incluye "Usuario no encontrado")
  if (error || !datosPerfil) {
    return (
      <View style={styles.centro}>
        <Text style={styles.errorTexto}>¡Error de carga! 😥</Text>
        <Text style={styles.errorMensaje}>
          {error || "El perfil no existe o no se pudo cargar."}
        </Text>
      </View>
    );
  }

  const publicaciones = datosPerfil?.publicaciones || [];

  const navegarAEditarPerfil = () => {
    navigation.navigate("EditarPerfilPage");
  };

  return (
    <ScrollView style={styles.contenedor}>
      <EncabezadoPerfil
        usuario={datosPerfil}
        alEditar={navegarAEditarPerfil}
        esPerfilPropio={true}
      />

      <View style={styles.seccionPublicaciones}>
        <Text style={styles.tituloSeccion}>Publicaciones</Text>

        <ListaPublicacionesUsuario publicaciones={publicaciones} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: "#fff" },
  centro: { flex: 1, justifyContent: "center", alignItems: "center" },
  textoError: {
    color: "red",
    fontSize: 18,
    marginBottom: 5,
    fontWeight: "bold",
  },
  linkLogin: {
    color: "#4CAF50",
    marginTop: 10,
    fontSize: 16,
    textDecorationLine: "underline",
  },
  errorTexto: { color: "red", fontSize: 18, marginBottom: 10 },
  errorMensaje: { color: "#31ec08ff", textAlign: "center", paddingHorizontal: 20 },
  seccionPublicaciones: { padding: 5 },
  tituloSeccion: {
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 5,
  },
});

export default PerfilPage;
