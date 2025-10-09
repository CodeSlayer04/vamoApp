// src/components/TarjetaPublicacion.jsx (CÓDIGO ACTUALIZADO PARA NAVEGACIÓN)

import React from 'react';
// Asegúrate de que este import sea correcto:
import { useNavigation } from '@react-navigation/native'; // <-- CLAVE
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'; 


const TarjetaPublicacion = ({ publicacion }) => {
    
    // 2. Obtener el objeto de navegación
    const navigation = useNavigation();

    // 3. Definir la función de navegación dinámica
    const navegarADetalle = () => {
        // Navega a la ruta 'DetallePublicacion' que definiste en App.jsx
        // y le pasa el ID de la publicación como parámetro
        navigation.navigate('DetallePublicacion', { 
            idPublicacion: publicacion.id 
        });
        console.log(`Navegando al detalle del post: ${publicacion.id}`);
    };

    return (
        // 4. Usar TouchableOpacity y conectar el onPress
        <TouchableOpacity 
            style={styles.contenedor}
            onPress={navegarADetalle} // <-- CONEXIÓN CON EL CONTROLADOR
        >
            {/* Imagen de la publicación */}
            <Image
                source={{ uri: publicacion.imagenUrl }}
                style={styles.imagenPublicacion}
            />
            
            {/* Texto y likes */}
            <View style={styles.infoInferior}>
                <Text style={styles.textoPublicacion}>{publicacion.texto}</Text>
                <View style={styles.contenedorEstadisticas}>
                    <Text style={styles.estadistica}>❤️ {publicacion.likes}</Text>
                    <Text style={styles.estadistica}>💬 {publicacion.comentarios}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    contenedor: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 15,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#eee'
    },
    imagenPublicacion: {
        width: '100%',
        height: 200, 
    },
    infoInferior: {
        padding: 10,
    },
    textoPublicacion: {
        fontSize: 16,
        marginBottom: 5,
        color: '#333'
    },
    contenedorEstadisticas: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: 5
    },
    estadistica: {
        fontSize: 14,
        color: '#666',
        marginRight: 15,
        fontWeight: 'bold'
    }
});

export default TarjetaPublicacion;
