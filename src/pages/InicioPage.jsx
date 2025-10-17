<<<<<<< HEAD
// src/pages/InicioPage.jsx

import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
// 🛑 Componente que lista usuarios para seguir
import SugerenciasUsuarios from '../components/SugerenciasUsuarios'; 

// Importa cualquier otro componente de tu feed
// import ListaPublicacionesFeed from '../components/ListaPublicacionesFeed'; 

const InicioPage = () => {

=======

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
>>>>>>> bb3194ba78bc22bf6c8f1c4393cdd8f57726993b
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={styles.container}>
                
                {/* 🛑 SECCIÓN DE USUARIOS SUGERIDOS (para probar el seguimiento) */}
                <SugerenciasUsuarios />
                
                {/* Título de tu feed principal */}
                <Text style={styles.feedTitle}>Tu Feed Principal</Text>
                
                {/* Aquí va el componente que lista las publicaciones de los seguidos */}
                {/* <ListaPublicacionesFeed /> */}
                
                <View style={{ height: 500 }}>
                   {/* Espacio para tus publicaciones */}
                </View>

<<<<<<< HEAD
            </ScrollView>
        </SafeAreaView>
    );
=======
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
>>>>>>> bb3194ba78bc22bf6c8f1c4393cdd8f57726993b
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#fff' 
    },
    feedTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    // Añade el resto de tus estilos aquí
});

<<<<<<< HEAD
export default InicioPage;
=======
export default InicioPage;
>>>>>>> bb3194ba78bc22bf6c8f1c4393cdd8f57726993b
