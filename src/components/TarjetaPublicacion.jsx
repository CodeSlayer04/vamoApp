// src/components/TarjetaPublicacion.jsx

import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View, Text, StyleSheet, Image, TouchableOpacity, Modal, TextInput,
  KeyboardAvoidingView, Platform, FlatList, TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// ------------------------------------------------------------------
// COMPONENTE SECUNDARIO: Modal de Comentarios
// ------------------------------------------------------------------
const ComentariosModal = ({
  visible, onClose, comentarios, nuevoComentario, setNuevoComentario, agregarComentario,
}) => (
  <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={modalStyles.modalOverlay}>
        <TouchableWithoutFeedback>
          <View style={modalStyles.modalContainer}>
            <Text style={modalStyles.modalTitulo}>Comentarios ({comentarios.length})</Text>
            
            <FlatList
              data={comentarios}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={modalStyles.comentarioItem}>
                  <Text style={modalStyles.comentarioTexto}>• {item.texto}</Text> 
                </View>
              )}
              ListEmptyComponent={
                <Text style={modalStyles.sinComentarios}>Sé el primero en comentar</Text>
              }
              contentContainerStyle={comentarios.length === 0 && { flex: 1, justifyContent: 'center' }}
            />

            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={modalStyles.comentarioInputContainer}
              keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
            >
              <TextInput
                style={modalStyles.inputComentario}
                placeholder="Escribe un comentario..."
                value={nuevoComentario}
                onChangeText={setNuevoComentario}
                multiline={false}
              />
              <TouchableOpacity onPress={agregarComentario} disabled={!nuevoComentario.trim()}>
                <Ionicons 
                    name="send-sharp" 
                    size={24} 
                    color={nuevoComentario.trim() ? "darkgreen" : "#ccc"} 
                />
              </TouchableOpacity>
            </KeyboardAvoidingView>

            <TouchableOpacity onPress={onClose} style={modalStyles.btnCerrar}>
              <Text style={modalStyles.btnCerrarTexto}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  </Modal>
);

// ------------------------------------------------------------------
// COMPONENTE PRINCIPAL: TarjetaPublicacion
// ------------------------------------------------------------------
const TarjetaPublicacion = ({ publicacion }) => {
  const navigation = useNavigation();
  
  const initialLikes = publicacion.likesCount || publicacion.likes || 0;
  const initialComments = Array.isArray(publicacion.comentarios) ? publicacion.comentarios : [];

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [modalVisible, setModalVisible] = useState(false);
  const [comentarios, setComentarios] = useState(initialComments); 
  const [nuevoComentario, setNuevoComentario] = useState("");

  const DarLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const toggleComentarios = () => {
    setModalVisible(!modalVisible);
  };

  const agregarComentario = () => {
    const texto = nuevoComentario.trim();
    if (texto === "") return;

    const nuevo = { id: Date.now().toString(), texto: texto };
    setComentarios((prevComentarios) => [...prevComentarios, nuevo]);
    setNuevoComentario("");
  };

  const navegarADetalle = () => {
    navigation.navigate("DetallePublicacionPage", { 
      idPublicacion: publicacion.id,
      publicacion: publicacion
    });
  };

  return (
    <>
      <TouchableOpacity 
        style={styles.contenedor} 
        onPress={navegarADetalle}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: publicacion.ImageUrl }}
          style={styles.imagenPublicacion}
        />

        <View style={styles.infoInferior}>
          <Text style={styles.textoPublicacion}>
            <Text style={styles.nombreUsuario}>{publicacion.nombreUsuario || 'Usuario'}: </Text>
            {publicacion.texto}
          </Text>

          <View style={styles.contenedorEstadisticas}>
            <TouchableOpacity onPress={DarLike} style={styles.likeContainer}>
              <Ionicons
                name={isLiked ? "heart" : "heart-outline"}
                size={24}
                color={isLiked ? "#E91E63" : "#444"}
              />
              <Text style={styles.contadorLikes}>{likeCount}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={toggleComentarios}
              style={styles.comentarioBoton}
            >
              <Ionicons
                name="chatbox-ellipses-outline"
                size={24}
                color="#444"
              />
              <Text style={styles.contadorComentarios}>
                {comentarios.length}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>

      <ComentariosModal
        visible={modalVisible}
        onClose={toggleComentarios}
        comentarios={comentarios}
        nuevoComentario={nuevoComentario}
        setNuevoComentario={setNuevoComentario}
        agregarComentario={agregarComentario}
      />
    </>
  );
};

const styles = StyleSheet.create({
  contenedor: { backgroundColor: "#fff", borderRadius: 10, marginBottom: 15, overflow: "hidden", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  imagenPublicacion: { width: "100%", height: 250 },
  infoInferior: { padding: 12 },
  textoPublicacion: { fontSize: 15, marginBottom: 8, color: "#333" },
  nombreUsuario: { fontWeight: 'bold' },
  contenedorEstadisticas: { flexDirection: "row", alignItems: "center" },
  likeContainer: { flexDirection: "row", alignItems: "center", marginRight: 20 },
  comentarioBoton: { flexDirection: "row", alignItems: "center" },
  contadorLikes: { fontSize: 16, marginLeft: 6, color: "#444", fontWeight: "500" },
  contadorComentarios: { fontSize: 16, marginLeft: 6, color: "#444", fontWeight: "500" }
});

const modalStyles = StyleSheet.create({
    modalOverlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.6)" },
    modalContainer: { backgroundColor: "#fff", height: "80%", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
    modalTitulo: { fontSize: 20, fontWeight: "bold", marginBottom: 15, borderBottomWidth: 1, borderBottomColor: "#eee", paddingBottom: 10 },
    comentarioItem: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#f0f0f0" },
    comentarioTexto: { fontSize: 15, color: "#333" },
    sinComentarios: { color: "#666", fontStyle: "italic", textAlign: 'center', paddingVertical: 20 },
    comentarioInputContainer: { flexDirection: "row", alignItems: "center", paddingTop: 10, borderTopWidth: 1, borderTopColor: '#eee' },
    inputComentario: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 25, padding: 10, paddingHorizontal: 15, marginRight: 8 },
    btnCerrar: { marginTop: 15, padding: 10, alignSelf: "center", backgroundColor: '#f5f5f5', borderRadius: 10 },
    btnCerrarTexto: { color: "#444", fontSize: 16, fontWeight: "600" },
});

export default TarjetaPublicacion;