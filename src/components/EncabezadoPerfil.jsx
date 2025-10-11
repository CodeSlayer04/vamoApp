// src/components/EncabezadoPerfil.jsx

import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

const EncabezadoPerfil = ({ usuario, alEditar }) => {
  const uriFoto =
    usuario.fotoUrl || "https://via.placeholder.com/100/4CAF50/FFFFFF?text=V";

  return (
    <View style={styles.contenedorPrincipal}>
      <View style={styles.filaSuperior}>
        <Image source={{ uri: uriFoto }} style={styles.imagenPerfil} />

        <TouchableOpacity style={styles.botonEditar} onPress={alEditar}>
          <Text style={styles.textoBotonEditar}>Editar Perfil</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.textoNombre}>{usuario.nombre}</Text>
      <Text style={styles.textoBio}>{usuario.biografia}</Text>

      <View style={styles.contenedorEstadisticas}>
        <View style={styles.itemEstadistica}>
          <Text style={styles.valorEstadistica}>{usuario.seguidores}</Text>
          <Text style={styles.etiquetaEstadistica}>Seguidores</Text>
        </View>
        <View style={styles.itemEstadistica}>
          <Text style={styles.valorEstadistica}>{usuario.seguidos}</Text>
          <Text style={styles.etiquetaEstadistica}>Seguidos</Text>
        </View>
        <View style={styles.itemEstadistica}>
          <Text style={styles.valorEstadistica}>
            {usuario.lugaresVisitados}
          </Text>
          <Text style={styles.etiquetaEstadistica}>Visitados</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contenedorPrincipal: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  filaSuperior: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  imagenPerfil: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#4CAF50",
  },
  botonEditar: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#f9f9f9",
  },
  textoBotonEditar: { color: "#333", fontWeight: "600" },
  textoNombre: { fontSize: 24, fontWeight: "bold", marginBottom: 5 },
  textoBio: { fontSize: 14, color: "#666", marginBottom: 20 },
  contenedorEstadisticas: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  itemEstadistica: { alignItems: "center" },
  valorEstadistica: { fontSize: 20, fontWeight: "bold", color: "#4CAF50" },
  etiquetaEstadistica: { fontSize: 12, color: "#666" },
});

export default EncabezadoPerfil;
