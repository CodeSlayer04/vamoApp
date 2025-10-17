import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../config/firebaseconfig"; 

const Register = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");

  const registerUser = async () => {
    if (!email || !password || !nombre) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    try {
   
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

  
      await setDoc(doc(db, "usuarios", user.uid), {
        nombre: nombre,
        correo: email,
        fotoPerfil: "",
        biografia: "",
        fechaRegistro: serverTimestamp(),
        ultimaConexion: serverTimestamp(),
        tokenExpo: "",
        seguidores: [],
        siguiendo: [],
        privado: false,
      });

  
      Alert.alert("Éxito", "Usuario registrado correctamente");


      setEmail("");
      setPassword("");
      setNombre("");
      navigation.navigate("Login");
    } catch (error) {
      console.error(error);
      let mensaje = "Error al registrar el usuario";
      if (error.code === "auth/email-already-in-use") {
        mensaje = "Este correo ya está registrado";
      } else if (error.code === "auth/invalid-email") {
        mensaje = "Correo electrónico no válido";
      } else if (error.code === "auth/weak-password") {
        mensaje = "La contraseña debe tener al menos 6 caracteres";
      }
      Alert.alert("Error", mensaje);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro de Usuario</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre completo"
        value={nombre}
        onChangeText={setNombre}
      />

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Registrar" color="#4CAF50" onPress={registerUser} />

      <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
        ¿Ya tienes cuenta? Inicia sesión
      </Text>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  link: {
    marginTop: 15,
    color: "blue",
    textDecorationLine: "underline",
  },
});

export default Register;
