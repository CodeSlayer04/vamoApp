// src/pages/PerfilPage.jsx (CÓDIGO ACTUALIZADO PARA NAVEGACIÓN)

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native"; // <-- 1. IMPORTAR HOOK DE NAVEGACIÓN

// Importamos el Controlador y las Vistas
import { useObtenerPerfilUsuario } from "../hooks/useObtenerPerfilUsuario";
import EncabezadoPerfil from "../components/EncabezadoPerfil";
import BotonSeguir from "../components/BotonSeguir";
import ListaPublicacionesUsuario from "../components/ListaPublicacionesUsuario";

const ID_PERFIL_ACTUAL = "HV220231";
const ID_USUARIO_LOGUEADO = "HV220231";

const PerfilPage = () => {
  const { datosPerfil, estaCargando, error } =
    useObtenerPerfilUsuario(ID_PERFIL_ACTUAL);

  const esPerfilPropio = ID_PERFIL_ACTUAL === ID_USUARIO_LOGUEADO;

  // ... (manejo de estados, carga y error)
  if (estaCargando || error || !datosPerfil) {
    // Retornar manejo de estados de carga/error
    return (
      <View style={styles.contenedorCentrado}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  // 4. Pasar la función de navegación a la Vista
  return (
    <ScrollView style={styles.contenedorScroll}>
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
