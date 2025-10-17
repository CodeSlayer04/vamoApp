import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../config/firebaseconfig"; 

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    try {
     
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      
      const userRef = doc(db, "usuarios", user.uid);
      await updateDoc(userRef, {
        ultimaConexion: serverTimestamp(),
      });

    
      Alert.alert("Éxito", `Bienvenido, ${email}`);

      
      navigation.reset({
        index: 0,
        routes: [{ name: "MainTabs" }],
      });
    } catch (error) {
      console.error(error);
      let mensaje = "No se pudo iniciar sesión";
      if (error.code === "auth/user-not-found") {
        mensaje = "Usuario no encontrado";
      } else if (error.code === "auth/wrong-password") {
        mensaje = "Contraseña incorrecta";
      } else if (error.code === "auth/invalid-email") {
        mensaje = "Correo electrónico no válido";
      }
      Alert.alert("Error", mensaje);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>

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

      <Button title="Ingresar" color="#4CAF50" onPress={loginUser} />

      <Text style={styles.link} onPress={() => navigation.navigate("Register")}>
        ¿No tienes cuenta? Regístrate
      </Text>
    </View>
  );
};

// 🎨 Estilos integrados
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

export default Login;
