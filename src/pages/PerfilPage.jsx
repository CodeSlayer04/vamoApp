// src/pages/PerfilPage.jsx

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";

// Importamos el Controlador
import { useObtenerPerfilUsuario } from "../hooks/useObtenerPerfilUsuario";

// Importamos las Vistas
import EncabezadoPerfil from "../components/EncabezadoPerfil";
import BotonSeguir from "../components/BotonSeguir";
import ListaPublicacionesUsuario from "../components/ListaPublicacionesUsuario";

// ID de tu carné para cargar tu perfil de prueba
const ID_USUARIO_ACTUAL = "HV220231";

const PerfilPage = () => {
  // 1. Usar el Custom Hook (Controlador) para obtener el Modelo (datos)
  const { datosPerfil, estaCargando, error } =
    useObtenerPerfilUsuario(ID_USUARIO_ACTUAL);

  // 2. Manejo de estados: Carga y Error
  if (estaCargando) {
    return (
      <View style={styles.contenedorCentrado}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text>Cargando perfil...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.contenedorCentrado}>
        <Text style={styles.textoError}>
          Error al cargar el perfil: {error}
        </Text>
      </View>
    );
  }

  // 3. Renderizado de la Vista al tener los datos
  return (
    <ScrollView style={styles.contenedorScroll}>
      <EncabezadoPerfil
        usuario={datosPerfil} // El Modelo
        alEditar={() => console.log("TODO: Navegar a Edición de Perfil")}
      />

      <BotonSeguir esSiguiendo={datosPerfil.isFollowing} />

      <ListaPublicacionesUsuario publicaciones={datosPerfil.publicaciones} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contenedorScroll: { flex: 1, backgroundColor: "#f0f0f0" },
  contenedorCentrado: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textoError: { color: "red", fontSize: 16 },
});

export default PerfilPage;
