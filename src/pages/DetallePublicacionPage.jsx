
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  getFirestore,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
  collection,
  addDoc,
  serverTimestamp,getDoc
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import app from "../config/firebaseconfig";
import { FontAwesome } from "@expo/vector-icons";

const DetallePublicacionPage = ({ route }) => {
  const { id } = route.params;
  const [publicacion, setPublicacion] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [loadingComentario, setLoadingComentario] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState(null);

  const db = getFirestore(app);
  const auth = getAuth(app);

  
useEffect(() => {
  const comentariosRef = collection(db, "publicaciones", id, "comentarios");

  const unsubscribe = onSnapshot(comentariosRef, (snapshot) => {
    const cargarComentarios = async () => {
      const lista = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const data = doc.data();
          let nombreAutor = "Usuario";

          try {
            const usuarioRef = doc(db, "usuarios", data.autor);
            const usuarioSnap = await getDoc(usuarioRef);
            if (usuarioSnap.exists()) {
              nombreAutor = usuarioSnap.data().nombre || "Usuario";
            }
          } catch (error) {
            console.warn("Error al obtener nombre del autor:", error);
          }

          return {
            id: doc.id,
            texto: data.texto,
            autor: nombreAutor,
          };
        })
      );

      setComentarios(lista);
    };

    cargarComentarios();
  });

  return () => unsubscribe();
}, [id]);



  const toggleLike = async () => {
    if (!usuarioActual || !publicacion) return;

    const yaLeDioLike = publicacion.UsuariosLikes?.includes(usuarioActual.uid);
    const postRef = doc(db, "publicaciones", publicacion.id);

    await updateDoc(postRef, {
      Likes: yaLeDioLike ? publicacion.Likes - 1 : publicacion.Likes + 1,
      UsuariosLikes: yaLeDioLike
        ? arrayRemove(usuarioActual.uid)
        : arrayUnion(usuarioActual.uid),
    });
  };

  const enviarComentario = async () => {
    if (!nuevoComentario.trim() || !usuarioActual) return;

    setLoadingComentario(true);
    try {
      const comentariosRef = collection(db, "publicaciones", id, "comentarios");
      await addDoc(comentariosRef, {
        autor: usuarioActual.uid,
        texto: nuevoComentario.trim(),
        fecha: serverTimestamp(),
      });
      setNuevoComentario("");
    } catch (error) {
      console.error("Error al enviar comentario:", error);
    } finally {
      setLoadingComentario(false);
    }
  };

  if (!publicacion) {
    return (
      <View style={styles.centrado}>
        <Text>No se encontró la publicación.</Text>
      </View>
    );
  }

  const yaLeDioLike = usuarioActual && publicacion.UsuariosLikes?.includes(usuarioActual.uid);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: publicacion.ImageUrl }} style={styles.imagen} />
      <Text style={styles.titulo}>Publicación</Text>
      <Text style={styles.texto}>{publicacion.Detalles}</Text>

      <View style={styles.likeContainer}>
        <TouchableOpacity onPress={toggleLike}>
          <FontAwesome
            name={yaLeDioLike ? "heart" : "heart-o"}
            size={28}
            color={yaLeDioLike ? "#ff4081" : "#888"}
          />
        </TouchableOpacity>
        <Text style={styles.likes}>{publicacion.Likes || 0}</Text>
      </View>

      <View style={styles.comentarios}>
        <Text style={styles.subtitulo}>Comentarios</Text>
        {comentarios.map((c) => (
          <View key={c.id} style={styles.comentario}>
            <Text style={styles.comentarioAutor}>👤 {c.autor}</Text>
            <Text>{c.texto}</Text>
          </View>
        ))}

        {usuarioActual && (
          <View style={styles.comentarioForm}>
            <TextInput
              style={styles.input}
              placeholder="Escribe un comentario..."
              value={nuevoComentario}
              onChangeText={setNuevoComentario}
              editable={!loadingComentario}
            />
            <TouchableOpacity style={styles.enviarBtn} onPress={enviarComentario}>
              <Text style={styles.enviarBtnText}>Enviar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff" },
  centrado: { flex: 1, justifyContent: "center", alignItems: "center" },
  imagen: { width: "100%", height: 250, borderRadius: 10, marginBottom: 20 },
  titulo: { fontSize: 24, fontWeight: "bold", marginBottom: 10, color: "#222" },
  texto: { fontSize: 16, color: "#444", marginBottom: 10 },
  likeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  likes: { marginLeft: 8, fontSize: 16, color: "#555" },
  comentarios: { marginTop: 20 },
  subtitulo: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  comentario: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  comentarioAutor: { fontWeight: "bold", marginBottom: 4 },
  comentarioForm: { marginTop: 10 },
  input: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  enviarBtn: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  enviarBtnText: { color: "#fff", fontWeight: "bold" },
});

export default DetallePublicacionPage;
