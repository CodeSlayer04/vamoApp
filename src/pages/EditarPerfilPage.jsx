// src/pages/EditarPerfilPage.jsx

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import { auth } from "../config/firebaseconfig";
import { useObtenerPerfilUsuario } from "../hooks/useObtenerPerfilUsuario";
import { actualizarPerfilUsuario } from "../servicios/perfilServicios";

const EditarPerfilPage = ({ navigation }) => {
  // Obtener el ID del usuario actual
  const userId = auth.currentUser ? auth.currentUser.uid : null;
  const { datosPerfil, estaCargando } = useObtenerPerfilUsuario(userId);

  // Estados para el formulario
  const [nombre, setNombre] = useState("");
  const [biografia, setBiografia] = useState("");
  const [fotoUriLocal, setFotoUriLocal] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Llenar campos iniciales al cargar los datos
  useEffect(() => {
    if (datosPerfil) {
      setNombre(datosPerfil.nombre || "");
      setBiografia(datosPerfil.biografia || "");
      // Usar 'fotoPerfil' que es el nombre correcto en tu BD
      setFotoUriLocal(datosPerfil.fotoPerfil || null);
    }
  }, [datosPerfil]);

  // Función para seleccionar imagen
  const seleccionarImagen = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permiso Denegado",
        "Necesitas dar permiso para acceder a la galería."
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setFotoUriLocal(result.assets[0].uri);
    }
  };

  // Función de guardado de cambios
  const guardarCambios = async () => {
    if (!userId) return;

    setIsSaving(true);
    try {
      const fotoActual = datosPerfil?.fotoPerfil;

      // Compara la URL de la foto original con la URL local/nueva para saber si hay que subir
      const fotoCambiada = fotoUriLocal && fotoUriLocal !== fotoActual;

      await actualizarPerfilUsuario(userId, {
        nombre,
        biografia,
        nuevaFotoURI: fotoCambiada ? fotoUriLocal : null,
        fotoActual: fotoActual,
      });

      Alert.alert("Éxito", "Tu perfil se ha actualizado correctamente.");
      setTimeout(() => navigation.goBack(), 500);
    } catch (error) {
      console.error("Error al guardar:", error);
      Alert.alert(
        "Error",
        error.message || "Hubo un error al guardar los cambios."
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Función de cerrar sesión
  const logout = async () => {
    try {
      await auth.signOut();
      await AsyncStorage.removeItem("currentUser");

      Alert.alert("Sesión cerrada", "Has cerrado sesión correctamente.");

      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      Alert.alert("Error", "No se pudo cerrar sesión");
    }
  };

  // VISTA: Carga y Error
  if (estaCargando) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (!datosPerfil) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          No se pudo cargar el perfil para edición.
        </Text>
      </View>
    );
  }

  // VISTA: Formulario Principal
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>

      {/* Sección de Foto de Perfil */}
      <View style={styles.photoContainer}>
        <Image
          source={{ uri: fotoUriLocal || "https://img.freepik.com/vector-premium/icono-membresia-plateado-icono-perfil-avatar-defecto-icono-miembros-imagen-usuario-redes-sociales-ilustracion-vectorial_561158-4195.jpg" }}
          style={styles.profileImage}
        />
        <TouchableOpacity style={styles.editButton} onPress={seleccionarImagen}>
          <Ionicons name="camera" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Campo Nombre de Usuario */}
      <Text style={styles.label}>Nombre de Usuario</Text>
      <TextInput
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
        placeholder="Ingresa tu nuevo nombre"
      />

      {/* Campo Biografía */}
      <Text style={styles.label}>Biografía</Text>
      <TextInput
        style={[styles.input, styles.bioInput]}
        value={biografia}
        onChangeText={setBiografia}
        placeholder="Escribe algo sobre ti..."
        multiline
        numberOfLines={4}
      />

      {/* Botón Guardar */}
      <TouchableOpacity
        style={styles.saveButton}
        onPress={guardarCambios}
        disabled={isSaving}
      >
        {isSaving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>Guardar Cambios</Text>
        )}
      </TouchableOpacity>

      {/* Botón Cerrar Sesión (Al final) */}
      <View style={[styles.buttonContainer, { marginTop: 40 }]}>
        <Button title="Cerrar sesión" color="#E53935" onPress={logout} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  errorText: { color: "red", fontSize: 16 },

  photoContainer: { alignItems: "center", marginBottom: 30, marginTop: 10 },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: "#fff",
  },
  editButton: {
    position: "absolute",
    bottom: 0,
    right: "35%",
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#fff",
  },

  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  bioInput: { height: 100, textAlignVertical: "top" },

  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  saveButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },

  buttonContainer: { width: "100%", alignItems: "center" },
});

export default EditarPerfilPage;
