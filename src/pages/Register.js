import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Register = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const registerUser = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    try {
      const storedUsers = await AsyncStorage.getItem('usuarios');
      let users = storedUsers ? JSON.parse(storedUsers) : [];

      // Verificar si el usuario ya existe
      if (users.some(u => u.username === username)) {
        Alert.alert('Error', 'Este usuario ya está registrado');
        return;
      }

      const newUser = { username, password };
      users.push(newUser);

      await AsyncStorage.setItem('usuarios', JSON.stringify(users));

      Alert.alert('Éxito', 'Usuario registrado correctamente');
      setUsername('');
      setPassword('');

      // Redirigir a la pantalla de login
      navigation.navigate('Login');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo registrar el usuario');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro de Usuario</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre de usuario"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Registrar" color="#4CAF50" onPress={registerUser} />

      <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
        ¿Ya tienes cuenta? Inicia sesión
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30 },
  input: { width: '100%', backgroundColor: 'white', borderRadius: 10, padding: 10, marginBottom: 15, borderWidth: 1, borderColor: '#ccc' },
  link: { marginTop: 15, color: 'blue', textDecorationLine: 'underline' },
});

export default Register;
