
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { updateDoc, doc, getFirestore } from "firebase/firestore";
import app from "../config/firebaseconfig";

const CLOUDINARY_CLOUD_NAME = 'dtfmdf4iu';
const CLOUDINARY_UPLOAD_PRESET = 'Vamoapp_upload';

const EditarPublicacionPage = ({ route, navigation }) => {
  const { publicacion } = route.params;
  const [detalles, setDetalles] = useState(publicacion.Detalles || "");
  const [imagen, setImagen] = useState(publicacion.ImageUrl || "");
  const [subiendo, setSubiendo] = useState(false);

  const seleccionarImagen = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!resultado.canceled) {
      setImagen(resultado.assets[0].uri);
    }
  };

  const subirImagenACloudinary = async (uri) => {
    const formData = new FormData();
    formData.append("file", {
      uri,
      type: "image/jpeg",
      name: `edit_${Date.now()}.jpg`,
    });
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(`Error en Cloudinary: ${data.error.message}`);
    }

    return data.secure_url;
  };

  const guardarCambios = async () => {
    setSubiendo(true);
    try {
      const db = getFirestore(app);
      const ref = doc(db, "publicaciones", publicacion.id);

      let nuevaImagen = imagen;

      // Si la imagen fue cambiada (no es una URL de Cloudinary)
      if (imagen !== publicacion.ImageUrl && !imagen.startsWith("http")) {
        nuevaImagen = await subirImagenACloudinary(imagen);
      }

      await updateDoc(ref, {
        Detalles: detalles.trim(),
        ImageUrl: nuevaImagen,
      });

      Alert.alert("Éxito", "Publicación actualizada correctamente.");
      navigation.goBack();
    } catch (error) {
      console.error("Error al actualizar publicación:", error);
      Alert.alert("Error", error.message || "No se pudo actualizar la publicación.");
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Publicación</Text>

      <Image source={{ uri: imagen }} style={styles.image} />
      <TouchableOpacity style={styles.button} onPress={seleccionarImagen}>
        <Text style={styles.buttonText}>Cambiar Imagen</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Edita los detalles"
        multiline
        value={detalles}
        onChangeText={setDetalles}
        editable={!subiendo}
      />

      {subiendo ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : (
        <TouchableOpacity style={styles.saveButton} onPress={guardarCambios}>
          <Text style={styles.buttonText}>Guardar Cambios</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  image: { width: "100%", height: 200, borderRadius: 10, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 5,
  },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
});

export default EditarPublicacionPage;
