import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import App from '../App';

const Login = ({ navigation }) => {
 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre de usuario"
        /*
        value={username}
        onChangeText={setUsername}*/
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
      
      />

      <Button title="Ingresar" color="#4CAF50" onPress={loginUser} />

      <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
        ¿No tienes cuenta? Regístrate
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

export default Login;
