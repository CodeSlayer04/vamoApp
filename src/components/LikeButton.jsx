import React, { useState, useEffect } from "react";
import { TouchableOpacity, Text, Alert, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

// Asumo que 'app' se importa desde donde se inicializa Firebase.
// Si estás usando un contexto global de Firebase, ajusta esta línea.
import app from "../config/firebaseconfig"; 

// Inicializa Auth y Firestore fuera del componente si es posible, o asegúrate de tener 'app' disponible.
const auth = getAuth(app);
const db = getFirestore(app);

const LikeButton = ({ publicacionId, initialLikes, usuariosLikes = [] }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikes);
  const user = auth.currentUser;
  const userId = user?.uid;

  useEffect(() => {
    // 1. Determina si el usuario ya le dio like al cargar
    if (userId && usuariosLikes.includes(userId)) {
      setIsLiked(true);
    }
  }, [userId, usuariosLikes]);

  const toggleLike = async () => {
    if (!userId) {
      Alert.alert("Acceso denegado", "Debes iniciar sesión para dar 'Me Gusta'.");
      return;
    }

    // Referencia al documento de la publicación
    const postRef = doc(db, "publicaciones", publicacionId);
    const newLikedStatus = !isLiked;
    
    // Optimistic UI Update: Actualiza inmediatamente la interfaz
    setIsLiked(newLikedStatus);
    setLikeCount(prevCount => newLikedStatus ? prevCount + 1 : prevCount - 1);

    try {
      if (newLikedStatus) {
        // Añadir el UID al array y aumentar el contador
        await updateDoc(postRef, {
          UsuariosLikes: arrayUnion(userId),
          Likes: likeCount + 1,
        });
      } else {
        // Eliminar el UID del array y disminuir el contador
        await updateDoc(postRef, {
          UsuariosLikes: arrayRemove(userId),
          Likes: likeCount - 1,
        });
      }
    } catch (error) {
      console.error("Error al actualizar like:", error);
      // Revertir la interfaz si hay un error
      setIsLiked(!newLikedStatus);
      setLikeCount(prevCount => newLikedStatus ? prevCount - 1 : prevCount + 1);
      Alert.alert("Error", "No se pudo registrar el like. Inténtalo de nuevo.");
    }
  };

  return (
    <TouchableOpacity onPress={toggleLike} style={styles.likeContainer}>
      <Ionicons
        name={isLiked ? "heart" : "heart-outline"}
        size={24}
        color={isLiked ? "#E91E63" : "#444"}
      />
      <Text style={styles.contadorLikes}>{likeCount}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  likeContainer: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginRight: 20 
  },
  contadorLikes: { 
    fontSize: 16, 
    marginLeft: 6, 
    color: "#444", 
    fontWeight: "500" 
  },
});

export default LikeButton;