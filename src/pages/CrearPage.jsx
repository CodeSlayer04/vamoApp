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

const CLOUDINARY_CLOUD_NAME = 'dtfmdf4iu'; 
const CLOUDINARY_UPLOAD_PRESET = 'Vamoapp_upload'; 

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
      const db = getFirestore(app);

      let downloadURL = "";

      if (image) {
       // procedimiento para subir las imagenes a cloudinary
        const formData = new FormData();
        
     
        formData.append('file', {
       
          uri: image, 
          name: `${uid}_${Date.now()}.jpg`, 
          type: 'image/jpeg', 
        });
        
        
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        
      
        const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

     
        const response = await fetch(uploadUrl, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (data.error) {
        
            throw new Error(`Error en Cloudinary: ${data.error.message}`);
        }

        downloadURL = data.secure_url; 
        
       //proceso para el guardado de las publicaciones en firebase 
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
     
      Alert.alert("Error", error.message || "No se pudo guardar la publicación. Revisa tu conexión y configuración de Cloudinary.");
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
    fontWeight: "bold",
  },
  preview: {
    marginTop: 20,
    width: "100%",
    aspectRatio: 4 / 3, 
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
  },
});