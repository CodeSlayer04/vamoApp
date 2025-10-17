import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Alert,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { auth } from "../config/firebaseconfig";

import { useObtenerPerfilUsuario } from "../hooks/useObtenerPerfilUsuario";
import EncabezadoPerfil from "../components/EncabezadoPerfil";
// Asumiendo que ya tienes este componente de seguimiento
import BotonSeguir from "../components/BotonSeguir"; 
import ListaPublicacionesUsuario from "../components/ListaPublicacionesUsuario";


const PerfilOtroUsuarioPage = () => {
    const route = useRoute();
    // 🛑 Obtener el ID del usuario a ver de los parámetros de navegación
    const targetUserId = route.params?.userId; 
    
    const usuarioLogueadoId = auth.currentUser ? auth.currentUser.uid : null;

    // Cargar los datos del perfil que estamos viendo (el ajeno)
    const { datosPerfil, estaCargando, error } = useObtenerPerfilUsuario(targetUserId);

    // Si el usuario logueado intenta ver su propio perfil, lo redirigimos (opcional)
    if (targetUserId === usuarioLogueadoId) {
        // Podrías navegar a la PerfilPage principal aquí
        return (
            <View style={styles.contenedorCentrado}>
                <Text>Esto es tu propio perfil, usa PerfilPage.</Text>
            </View>
        );
    }
    
    // Manejo de la Carga y Error
    if (estaCargando || !datosPerfil) {
        return (
            <View style={styles.contenedorCentrado}>
                <ActivityIndicator size="large" color="#4CAF50" />
            </View>
        );
    }
    
    if (error) {
        Alert.alert("Error", "No se pudo cargar este perfil.");
        return (
            <View style={styles.contenedorCentrado}>
                <Text style={styles.textoError}>Perfil no encontrado</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.contenedorScroll}>
            <EncabezadoPerfil
                usuario={datosPerfil}
                esPerfilPropio={false} // Siempre falso para este componente
                // Se pasa el Botón de Seguir como un componente custom
                CustomButton={
                    <BotonSeguir 
                        targetUserId={targetUserId} 
                        currentUserId={usuarioLogueadoId} 
                    />
                }
            />
            
            <View style={styles.seccionPublicaciones}>
                <Text style={styles.tituloSeccion}>Publicaciones</Text>
                <ListaPublicacionesUsuario publicaciones={datosPerfil.publicaciones} />
            </View>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    contenedorScroll: { flex: 1, backgroundColor: "#fff" },
    contenedorCentrado: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    textoError: { color: "red", fontSize: 16 },
    seccionPublicaciones: { padding: 5 },
    tituloSeccion: {
        fontSize: 20,
        fontWeight: "bold",
        marginHorizontal: 15,
        marginTop: 10,
        marginBottom: 5,
    },
});

export default PerfilOtroUsuarioPage;