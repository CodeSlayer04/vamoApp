// src/pages/DetallePublicacionPage.jsx
import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";

const DetallePublicacionPage = ({ route }) => {
  // ✅ Recuperamos el objeto enviado desde la navegación
  const { publicacion } = route.params;

  if (!publicacion) {
    return (
      <View style={styles.centrado}>
        <Text>No se encontró la publicación.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Imagen principal */}
      <Image source={{ uri: publicacion.imagenUrl }} style={styles.imagen} />

      {/* Contenido */}
      <Text style={styles.titulo}>Publicación #{publicacion.id}</Text>
      <Text style={styles.texto}>{publicacion.texto}</Text>

      {/* Información adicional opcional */}
      {publicacion.fecha && (
        <Text style={styles.fecha}>📅 {publicacion.fecha}</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  centrado: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imagen: {
    width: "100%",
    height: 250,
    borderRadius: 10,
    marginBottom: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#222",
  },
  texto: {
    fontSize: 16,
    color: "#444",
    marginBottom: 20,
  },
  fecha: {
    fontSize: 14,
    color: "#888",
  },
});

export default DetallePublicacionPage;
