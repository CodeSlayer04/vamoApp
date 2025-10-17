// src/pages/InicioPage.jsx

import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import SugerenciasUsuarios from "../components/SugerenciasUsuarios";
import { useObtenerTodasLasPublicaciones } from "../hooks/useObtenerTodasLasPublicaciones";
import ListaPublicacionesUsuario from "../components/ListaPublicacionesUsuario";

const InicioPage = () => {
  const { publicaciones, cargando, error } = useObtenerTodasLasPublicaciones();

  if (cargando) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <SugerenciasUsuarios />
          <Text style={styles.feedTitle}>Tu Feed Principal</Text>
          <View style={{ height: 200, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" />
          </View>
        </ScrollView>
      </SafeAreaView>
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
      <SugerenciasUsuarios />
      <Text style={styles.feedTitle}>Tu Feed Principal</Text>
      <ListaPublicacionesUsuario publicaciones={publicaciones} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contenedorScroll: {
    flex: 1,
    backgroundColor: "#fff",
  },
  feedTitle: {
    fontSize: 18,
    fontWeight: "bold",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  contenedorCentrado: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textoError: {
    color: "red",
  },
});

export default InicioPage;
