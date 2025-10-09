// src/components/ListaPublicacionesUsuario.jsx (CÓDIGO LIMPIO Y CORRECTO)

import React from 'react';
// Eliminamos Image porque ya no se usa directamente en este archivo
import { View, Text, StyleSheet, FlatList } from 'react-native'; 

// Importar el componente modular (LA VISTA REAL)
import TarjetaPublicacion from './TarjetaPublicacion'; 

const ListaPublicacionesUsuario = ({ publicaciones }) => {
    return (
        <View style={styles.contenedor}>
            <Text style={styles.titulo}>Publicaciones Propias</Text>
            <FlatList
                data={publicaciones}
                keyExtractor={(item) => item.id}
                // ¡AQUÍ ESTÁ EL CAMBIO CRUCIAL!
                renderItem={({ item }) => (
                    // 1. Usamos el componente modular TarjetaPublicacion
                    <TarjetaPublicacion publicacion={item} />
                    // 2. Se eliminó todo el código de <View style={styles.placeholderPublicacion}>
                )}
                scrollEnabled={false} 
            />
        </View>
    );
};

const styles = StyleSheet.create({
    contenedor: { 
        padding: 10 
    },
    titulo: { 
        fontSize: 20, 
        fontWeight: 'bold', 
        marginLeft: 10, 
        marginBottom: 10 
    },
    
    // **SE ELIMINARON:**
    // - placeholderPublicacion
    // - textoPublicacion
    // - estadisticas
    // - imagenPublicacion
    // Estos estilos ahora solo existen en TarjetaPublicacion.jsx
});

export default ListaPublicacionesUsuario;