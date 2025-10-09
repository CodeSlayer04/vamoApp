// src/components/TarjetaPublicacion.jsx

import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

/**
 * Componente Vista para mostrar una sola publicación en el perfil.
 * @param {object} publicacion - Objeto con los datos de un post (imagenUrl, texto, likes, etc.)
 */
const TarjetaPublicacion = ({ publicacion }) => {
  return (
    <View style={styles.contenedor}>
      {/* Imagen de la publicación */}
      <Image
        source={{ uri: publicacion.imagenUrl }}
        style={styles.imagenPublicacion}
      />

      {/* Texto y likes */}
      <View style={styles.infoInferior}>
        <Text style={styles.textoPublicacion}>{publicacion.texto}</Text>
        <View style={styles.contenedorEstadisticas}>
          {/* Iconos de Likes y Comentarios (TODO: Agregar iconos de Assets) */}
          <Text style={styles.estadistica}>❤️ {publicacion.likes}</Text>
          <Text style={styles.estadistica}>💬 {publicacion.comentarios}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#eee",
  },
  imagenPublicacion: {
    width: "100%",
    height: 200,
  },
  infoInferior: {
    padding: 10,
  },
  textoPublicacion: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  contenedorEstadisticas: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 5,
  },
  estadistica: {
    fontSize: 14,
    color: "#666",
    marginRight: 15,
    fontWeight: "bold",
  },
});

export default TarjetaPublicacion;
