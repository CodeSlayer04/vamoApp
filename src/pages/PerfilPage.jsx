// src/pages/PerfilPage.jsx (ACTUALIZAR)

import React, { useEffect } from "react"; //Asegúrate de importar 'useEffect'
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
//IMPORTAR useIsFocused de React Navigation
import { useIsFocused } from "@react-navigation/native";

import { auth } from "../config/firebaseconfig";
//Asegúrate de que esta importación sea la del hook actualizado
import { useObtenerPerfilUsuario } from "../hooks/useObtenerPerfilUsuario";
import EncabezadoPerfil from "../components/EncabezadoPerfil";
import ListaPublicacionesUsuario from "../components/ListaPublicacionesUsuario";

const PerfilPage = ({ navigation }) => {
  //USAR el hook useIsFocused
  const isFocused = useIsFocused();
  const userId = auth.currentUser ? auth.currentUser.uid : null;

  //OBTENER la función recargarPerfil del hook
  const { datosPerfil, estaCargando, error, recargarPerfil } =
    useObtenerPerfilUsuario(userId);

  //LÓGICA CLAVE: Recargar datos cuando la pantalla se enfoca (al regresar de EditarPerfilPage)
  useEffect(() => {
    if (isFocused) {
      console.log("PerfilPage enfocada. Recargando datos...");
      recargarPerfil(); // Llama a la función del hook para actualizar
    }
  }, [isFocused, recargarPerfil]);

  // Manejo de la No-Autenticación (Tu código original)
  if (!userId) {
    // ... (Código de manejo de no-autenticación)
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

  // Manejo de la Carga (Tu código original)
  if (estaCargando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text>Cargando perfil...</Text>
      </View>
    );
  }

  // Manejo del Error (Tu código original)
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
        <ListaPublicacionesUsuario publicaciones={publicaciones} mostrarBotonEditar={true} />
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
  errorMensaje: {
    color: "#31ec08ff",
    textAlign: "center",
    paddingHorizontal: 20,
  },
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
