
// src/pages/InicioPage.jsx

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useObtenerTodasLasPublicaciones } from "../hooks/useObtenerTodasLasPublicaciones";
import ListaPublicacionesUsuario from "../components/ListaPublicacionesUsuario";

const InicioPage = () => {
  const { publicaciones, cargando, error } = useObtenerTodasLasPublicaciones();

  if (cargando) {
    return (
      <View style={styles.contenedorCentrado}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.contenedorCentrado}>
        <Text style={styles.textoError}>Error al cargar el feed</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.contenedorScroll}>
      <ListaPublicacionesUsuario publicaciones={publicaciones} />
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

export default InicioPage;
