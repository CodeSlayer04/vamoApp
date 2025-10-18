import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { obtenerListaUsuarios } from '../servicios/perfilServicios';
import { auth } from '../config/firebaseconfig';
import { useNavigation } from '@react-navigation/native';

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/11789/11789135.png"; 

const SugerenciasUsuarios = () => {
    const navigation = useNavigation();
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const currentUserId = auth.currentUser ? auth.currentUser.uid : null;

    useEffect(() => {
        if (!currentUserId) {
            setLoading(false);
            return;
        }
        
        const fetchUsuarios = async () => {
            setLoading(true);
            const lista = await obtenerListaUsuarios(currentUserId);
            // Mostrar un máximo de 5 sugerencias
            setUsuarios(lista.slice(0, 5)); 
            setLoading(false);
        };
        fetchUsuarios();
    }, [currentUserId]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#007bff" />
            </View>
        );
    }
    
    if (usuarios.length === 0) {
        return null; 
    }

    const renderItem = ({ item }) => {
        const fotoUrl = item.fotoPerfil || DEFAULT_AVATAR;
        const nombreDisplay = item.nombre || 'Usuario Vamo';

        return (
            <TouchableOpacity 
                style={styles.card}
               
                onPress={() => navigation.navigate("PerfilOtroUsuarioPage", { userId: item.id })}
            >
                <Image source={{ uri: fotoUrl }} style={styles.avatar} />
                <Text style={styles.nombre} numberOfLines={1}>
                    {nombreDisplay.split(' ')[0]}
                </Text>
                <Text style={styles.sugerenciaText}>Sugerencia</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Descubrir usuarios</Text>
            <FlatList
                horizontal
                data={usuarios}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        paddingLeft: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 10,
    },
    loadingContainer: {
        padding: 10,
        alignItems: 'center',
    },
    titulo: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        paddingHorizontal: 5,
    },
    listContainer: {
        paddingRight: 15,
    },
    card: {
        width: 100,
        alignItems: 'center',
        marginHorizontal: 5,
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginBottom: 5,
        borderWidth: 2,
        borderColor: '#18ee0dff',
    },
    nombre: {
        fontSize: 13,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    sugerenciaText: {
        fontSize: 10,
        color: '#6c757d',
        marginTop: 2,
    }
});

export default SugerenciasUsuarios;