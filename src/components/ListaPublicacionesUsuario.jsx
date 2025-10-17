// src/components/ListaPublicacionesUsuario.jsx

import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import TarjetaPublicacion from "./TarjetaPublicacion";

/**
 * Componente que renderiza la lista de publicaciones de un usuario.
 * @param {Array<object>} publicaciones - Array de objetos de publicación.
 */
const ListaPublicacionesUsuario = ({ publicaciones }) => {
  
  if (!publicaciones || publicaciones.length === 0) {
    return (
      <View style={styles.contenedor}>
        <Text style={styles.textoVacio}>Este usuario aún no tiene publicaciones.</Text>
      </View>
    );
  }

  return (
    <View style={styles.contenedor}>
      <FlatList
        data={publicaciones}
        keyExtractor={(item) => item.id.toString()} 
        renderItem={({ item }) => <TarjetaPublicacion publicacion={item} />}
        // Desactivado para evitar conflictos si se anida dentro de un ScrollView
        scrollEnabled={false} 
        contentContainerStyle={styles.listaContenedor}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  contenedor: { paddingHorizontal: 10 },
  listaContenedor: { paddingBottom: 20 },
  textoVacio: { textAlign: 'center', marginTop: 20, fontSize: 14, color: '#888' }
});

export default ListaPublicacionesUsuario;