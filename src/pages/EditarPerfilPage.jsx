import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditarPerfilPage = ({ navigation }) => {
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('currentUser');
      Alert.alert('Sesión cerrada', 'Has cerrado sesión correctamente.');

      // Redirigir al Login o AuthStack
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo cerrar sesión');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pantalla de Edición de Perfil</Text>
      <Text style={styles.subtitle}>Aquí podrás editar tu información personal.</Text>

      {/* Botón para cerrar sesión */}
      <View style={styles.buttonContainer}>
        <Button title="Cerrar sesión" color="#E53935" onPress={logout} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '60%',
  },
});

export default EditarPerfilPage;
