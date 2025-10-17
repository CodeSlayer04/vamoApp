// src/pages/InicioPage.jsx

import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
// 🛑 Componente que lista usuarios para seguir
import SugerenciasUsuarios from '../components/SugerenciasUsuarios'; 

// Importa cualquier otro componente de tu feed
// import ListaPublicacionesFeed from '../components/ListaPublicacionesFeed'; 

const InicioPage = () => {

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

            </ScrollView>
        </SafeAreaView>
    );
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

export default InicioPage;