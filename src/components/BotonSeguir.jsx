// src/components/BotonSeguir.jsx

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const BotonSeguir = ({ esSiguiendo }) => {
    const textoBoton = esSiguiendo ? "Siguiendo" : "Seguir";
    const estiloBoton = esSiguiendo ? styles.botonSiguiendo : styles.botonSeguir;

    const manejarClick = () => {
        console.log(`TODO: Implementar lógica de seguimiento.`);
    };

    return (
        <TouchableOpacity style={estiloBoton} onPress={manejarClick}>
            <Text style={styles.textoBoton}>{textoBoton}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    botonSeguir: { backgroundColor: '#4CAF50', padding: 10, margin: 20, borderRadius: 8, alignItems: 'center' },
    botonSiguiendo: { backgroundColor: '#ccc', padding: 10, margin: 20, borderRadius: 8, alignItems: 'center' },
    textoBoton: { color: '#fff', fontWeight: 'bold' }
});

export default BotonSeguir;