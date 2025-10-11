import React from "react";

import { View, Text, StyleSheet, FlatList } from "react-native";

import TarjetaPublicacion from "./TarjetaPublicacion";

const ListaPublicacionesUsuario = ({ publicaciones }) => {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Publicaciones</Text>
      <FlatList
        data={publicaciones}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TarjetaPublicacion publicacion={item} />}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    padding: 10,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
    marginBottom: 10,
  },
});

export default ListaPublicacionesUsuario;
