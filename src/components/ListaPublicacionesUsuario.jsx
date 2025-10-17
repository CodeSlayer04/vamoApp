
import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  getFirestore,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import app from "../config/firebaseconfig";
import { FontAwesome } from "@expo/vector-icons";

const ListaPublicacionesUsuario = ({ publicaciones, mostrarBotonEditar = false }) => {
  const navigation = useNavigation();
  const db = getFirestore(app);
  const auth = getAuth(app);
  const usuarioActual = auth.currentUser;

  const toggleLike = async (pub) => {
    if (!usuarioActual) return;

    const yaLeDioLike = pub.UsuariosLikes?.includes(usuarioActual.uid);
    const postRef = doc(db, "publicaciones", pub.id);

    await updateDoc(postRef, {
      Likes: yaLeDioLike ? pub.Likes - 1 : pub.Likes + 1,
      UsuariosLikes: yaLeDioLike
        ? arrayRemove(usuarioActual.uid)
        : arrayUnion(usuarioActual.uid),
    });
  };

  return (
    <View style={styles.lista}>
      {publicaciones.map((pub) => {
        const yaLeDioLike =
          usuarioActual && pub.UsuariosLikes?.includes(usuarioActual.uid);

        return (
          <TouchableOpacity
            key={pub.id}
            style={styles.card}
            onPress={() =>
              navigation.navigate("DetallePublicacion", { id: pub.id })
            }
          >
            <Image source={{ uri: pub.ImageUrl }} style={styles.imagen} />
            <Text style={styles.detalles}>{pub.Detalles}</Text>

            <View style={styles.likeContainer}>
              <TouchableOpacity onPress={() => toggleLike(pub)}>
                <FontAwesome
                  name={yaLeDioLike ? "heart" : "heart-o"}
                  size={24}
                  color={yaLeDioLike ? "#ff4081" : "#888"}
                />
              </TouchableOpacity>
              <Text style={styles.likes}>{pub.Likes || 0}</Text>

              {mostrarBotonEditar && (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("EditarPublicacionPage", {
                      publicacion: pub,
                    })
                  }
                  style={{ marginLeft: 20 }}
                >
                  <Text style={{ color: "#4CAF50" }}>Editar</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  lista: { padding: 10 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
    elevation: 2,
  },
  imagen: { width: "100%", height: 200, borderRadius: 10 },
  detalles: { marginTop: 10, fontSize: 16, color: "#333" },
  likeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  likes: {
    marginLeft: 8,
    fontSize: 16,
    color: "#555",
  },
});

export default ListaPublicacionesUsuario;
