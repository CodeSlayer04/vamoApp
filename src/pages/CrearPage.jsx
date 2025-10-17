
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Alert,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import app from "../config/firebaseconfig";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function CrearPage() {
  const [image, setImage] = useState(null);
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permiso requerido",
          "Necesitas permitir el acceso a la cámara para crear una publicación"
        );
      }
    })();
  }, []);

  const openCamera = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setImage(uri);
      }
    } catch (e) {
      console.error("Error al abrir la cámara:", e);
      Alert.alert("Error", "No se pudo abrir la cámara.");
    }
  };

  const resetForm = () => {
    setImage(null);
    setDetails("");
    setLoading(false);
  };

  const uploadImageAndSavePost = async () => {
    if (!image && !details.trim()) {
      Alert.alert("Error", "Agrega una imagen o algún detalle para publicar.");
      return;
    }

    setLoading(true);

    try {
      const auth = getAuth(app);
      const user = auth.currentUser;
      if (!user) throw new Error("Usuario no autenticado.");

      const uid = user.uid;
      const storage = getStorage(app);
      const db = getFirestore(app);

      let downloadURL = "";

      if (image) {
        const response = await fetch(image);
        const blob = await response.blob();

        const fileName = `posts/${uid}_${Date.now()}`;
        const storageRef = ref(storage, fileName);
        await uploadBytes(storageRef, blob);
        downloadURL = await getDownloadURL(storageRef);
      }

      const post = {
        IdAutor: uid,
        Detalles: details.trim(),
        FechaCreacion: serverTimestamp(),
        Likes: 0,
        UsuariosLikes: [],
        ImageUrl: downloadURL,
      };

      await addDoc(collection(db, "publicaciones"), post);

      Alert.alert("Éxito", "Publicación creada correctamente.");
      resetForm();
    } catch (error) {
      console.error("Error guardando publicación:", error);
      Alert.alert("Error", error.message || "No se pudo guardar la publicación.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear publicación</Text>

      {!image ? (
        <TouchableOpacity style={styles.cameraBtn} onPress={openCamera}>
          <Text style={styles.btnText}>Abrir cámara</Text>
        </TouchableOpacity>
      ) : (
        <>
          <Image source={{ uri: image }} style={styles.preview} />

          <TextInput
            style={styles.input}
            placeholder="Agrega detalles (opcional)"
            multiline
            value={details}
            onChangeText={setDetails}
            editable={!loading}
          />

          {loading ? (
            <ActivityIndicator size="large" color="#000" />
          ) : (
            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.btn, styles.saveBtn]} onPress={uploadImageAndSavePost}>
                <Text style={styles.btnText}>Guardar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, styles.cancelBtn]}
                onPress={() =>
                  Alert.alert("Cancelar", "¿Deseas cancelar la publicación?", [
                    { text: "No" },
                    { text: "Sí", onPress: resetForm },
                  ])
                }
              >
                <Text style={styles.btnText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  preview: {
    marginTop: 20,
    width: 300,
    height: 400,
    borderRadius: 10,
  },
  input: {
    marginTop: 12,
    width: "100%",
    minHeight: 80,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    textAlignVertical: "top",
    backgroundColor: "#f9f9f9",
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 12,
    justifyContent: "space-between",
    width: "100%",
  },
  btn: {
    flex: 1,
    padding: 12,
    marginHorizontal: 6,
    borderRadius: 8,
    alignItems: "center",
  },
  saveBtn: {
    backgroundColor: "#28a745",
  },
  cancelBtn: {
    backgroundColor: "#dc3545",
  },
  cameraBtn: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
  },
});
