import React, { useState, useEffect } from "react";
import { TouchableOpacity, Text, Alert, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";


import app from "../config/firebaseconfig"; 


const auth = getAuth(app);
const db = getFirestore(app);

const LikeButton = ({ publicacionId, initialLikes, usuariosLikes = [] }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikes);
  const user = auth.currentUser;
  const userId = user?.uid;

  useEffect(() => {
    
    if (userId && usuariosLikes.includes(userId)) {
      setIsLiked(true);
    }
  }, [userId, usuariosLikes]);

  const toggleLike = async () => {
    if (!userId) {
      Alert.alert("Acceso denegado", "Debes iniciar sesión para dar 'Me Gusta'.");
      return;
    }

  
    const postRef = doc(db, "publicaciones", publicacionId);
    const newLikedStatus = !isLiked;
    
    
    setIsLiked(newLikedStatus);
    setLikeCount(prevCount => newLikedStatus ? prevCount + 1 : prevCount - 1);

    try {
      if (newLikedStatus) {
     
        await updateDoc(postRef, {
          UsuariosLikes: arrayUnion(userId),
          Likes: likeCount + 1,
        });
      } else {
     
        await updateDoc(postRef, {
          UsuariosLikes: arrayRemove(userId),
          Likes: likeCount - 1,
        });
      }
    } catch (error) {
      console.error("Error al actualizar like:", error);
    
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