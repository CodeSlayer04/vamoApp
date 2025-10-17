// src/components/EncabezadoPerfil.jsx

import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

/**
 * Componente EncabezadoPerfil
 * @param {object} usuario - Objeto con datos del perfil.
 * @param {function} alEditar - Función a ejecutar al presionar el botón de acción.
 * @param {boolean} esPerfilPropio - Indica si es el perfil del usuario actual.
 */
const EncabezadoPerfil = ({ usuario, alEditar, esPerfilPropio = true }) => {
    // 1. Valores por defecto (robustez)
    const nombre = usuario?.nombre || "Usuario Desconocido";
    const biografia = usuario?.biografia || "Viajero principiante, en busca de nuevos sitios";
    // .toLocaleString() para formatear números grandes
    const seguidores = usuario?.seguidores?.toLocaleString() || "0"; 
    const seguidos = usuario?.seguidos?.toLocaleString() || "0";
    const visitados = usuario?.lugaresVisitados?.toLocaleString() || "0";
    const fotoUrl = usuario?.fotoPerfil || "https://img.freepik.com/vector-premium/icono-membresia-plateado-icono-perfil-avatar-defecto-icono-miembros-imagen-usuario-redes-sociales-ilustracion-vectorial_561158-4195.jpg"; 

    // 2. Lógica del Botón (Editar vs. Seguir)
    const textoBoton = esPerfilPropio ? "Editar Perfil" : "Seguir";
    const estiloBoton = esPerfilPropio ? styles.botonEditar : styles.botonSeguir;

    return (
        <View style={styles.contenedorPrincipal}>
            {/* Fila Superior: Foto y Botón de Acción */}
            <View style={styles.filaSuperior}>
                <Image source={{ uri: fotoUrl }} style={styles.imagenPerfil} />

                <TouchableOpacity style={estiloBoton} onPress={alEditar}>
                    <Text style={styles.textoBotonEditar}>{textoBoton}</Text>
                </TouchableOpacity>
            </View>

            {/* Datos Personales */}
            <Text style={styles.textoNombre}>{nombre}</Text>
            <Text style={styles.textoBio}>{biografia}</Text>

            {/* Contenedor de Estadísticas */}
            <View style={styles.contenedorEstadisticas}>
                <View style={styles.itemEstadistica}>
                    <Text style={styles.valorEstadistica}>{seguidores}</Text>
                    <Text style={styles.etiquetaEstadistica}>Seguidores</Text>
                </View>
                <View style={styles.separadorVertical} />
                <View style={styles.itemEstadistica}>
                    <Text style={styles.valorEstadistica}>{seguidos}</Text>
                    <Text style={styles.etiquetaEstadistica}>Seguidos</Text>
                </View>
                <View style={styles.separadorVertical} />
                <View style={styles.itemEstadistica}>
                    <Text style={styles.valorEstadistica}>{visitados}</Text>
                    <Text style={styles.etiquetaEstadistica}>Visitados</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    contenedorPrincipal: { padding: 20, backgroundColor: "#fff", paddingBottom: 10 },
    filaSuperior: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
    imagenPerfil: { width: 100, height: 100, borderRadius: 50, borderWidth: 0 },
    botonEditar: { borderWidth: 1, borderColor: "#ccc", paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20, backgroundColor: "#f9f9f9" },
    botonSeguir: { backgroundColor: "#4CAF50", paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20 },
    textoBotonEditar: { color: "#333", fontWeight: "600" },
    textoNombre: { fontSize: 22, fontWeight: "bold", marginBottom: 2 },
    textoBio: { fontSize: 14, color: "#666", marginBottom: 15, fontStyle: 'italic' },
    contenedorEstadisticas: { flexDirection: "row", justifyContent: "space-around", paddingVertical: 10 },
    itemEstadistica: { alignItems: "center", flex: 1 },
    valorEstadistica: { fontSize: 18, fontWeight: "bold", color: "#4CAF50" },
    etiquetaEstadistica: { fontSize: 12, color: "#666" },
    separadorVertical: { height: '80%', width: 1, backgroundColor: '#eee', alignSelf: 'center' }
});

export default EncabezadoPerfil;