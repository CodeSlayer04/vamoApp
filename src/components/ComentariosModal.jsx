import React, { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, Modal, TextInput,
  KeyboardAvoidingView, Platform, FlatList, TouchableWithoutFeedback, ActivityIndicator, Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { 
  getFirestore, collection, query, orderBy, onSnapshot, 
  addDoc, serverTimestamp 
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

import app from "../config/firebaseconfig"; 

const db = getFirestore(app);
const auth = getAuth(app);

const ComentariosModal = ({ visible, onClose, publicacionId }) => {
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const user = auth.currentUser;

 
  useEffect(() => {
    if (!publicacionId || !visible) return;

   
    const comentariosRef = collection(db, "publicaciones", publicacionId, "comentarios");
    const q = query(comentariosRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const comentariosData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComentarios(comentariosData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error al escuchar comentarios:", error);
      Alert.alert("Error", "No se pudieron cargar los comentarios.");
      setIsLoading(false);
    });

  
    return () => unsubscribe();
  }, [publicacionId, visible]);

  
  const agregarComentario = async () => {
    const texto = nuevoComentario.trim();
    if (texto === "" || !user) return;
    
    setIsSending(true);

    try {
      const nuevoComentarioData = {
        autorId: user.uid,
        autorNombre: user.displayName || "Anónimo", 
        texto: texto,
        timestamp: serverTimestamp(),
      };

      await addDoc(collection(db, "publicaciones", publicacionId, "comentarios"), nuevoComentarioData);

      setNuevoComentario("");
    } catch (error) {
      console.error("Error al guardar comentario:", error);
      Alert.alert("Error", "No se pudo guardar el comentario.");
    } finally {
      setIsSending(false);
    }
  };
  
  
  const ComentarioItem = ({ item }) => (
    <View style={modalStyles.comentarioItem}>
      <Text style={modalStyles.comentarioTexto}>
        <Text style={modalStyles.comentarioAutor}>{item.autorNombre || 'Usuario'}: </Text>
        {item.texto}
      </Text>
      <Text style={modalStyles.comentarioFecha}>
        {item.timestamp ? new Date(item.timestamp.toDate()).toLocaleTimeString() : "Enviando..."}
      </Text>
    </View>
  );

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={modalStyles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={modalStyles.modalContainer}>
              <Text style={modalStyles.modalTitulo}>Comentarios ({comentarios.length})</Text>
              
              {isLoading ? (
                <ActivityIndicator size="large" color="#007bff" style={{ flex: 1 }} />
              ) : (
                <FlatList
                  data={comentarios}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={ComentarioItem}
                  ListEmptyComponent={
                    <Text style={modalStyles.sinComentarios}>Sé el primero en comentar</Text>
                  }
                  contentContainerStyle={comentarios.length === 0 && { flex: 1, justifyContent: 'center' }}
                />
              )}

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
                  editable={!isSending}
                />
                <TouchableOpacity onPress={agregarComentario} disabled={!nuevoComentario.trim() || isSending}>
                  {isSending ? (
                    <ActivityIndicator size="small" color="darkgreen" />
                  ) : (
                    <Ionicons 
                      name="send-sharp" 
                      size={24} 
                      color={nuevoComentario.trim() ? "darkgreen" : "#ccc"} 
                    />
                  )}
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
};

const modalStyles = StyleSheet.create({
    modalOverlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.6)" },
    modalContainer: { backgroundColor: "#fff", height: "80%", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
    modalTitulo: { fontSize: 20, fontWeight: "bold", marginBottom: 15, borderBottomWidth: 1, borderBottomColor: "#eee", paddingBottom: 10 },
    comentarioItem: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#f0f0f0" },
    comentarioTexto: { fontSize: 15, color: "#333" },
    comentarioAutor: { fontWeight: 'bold', color: '#007bff' },
    comentarioFecha: { fontSize: 12, color: '#999', marginTop: 2 },
    sinComentarios: { color: "#666", fontStyle: "italic", textAlign: 'center', paddingVertical: 20 },
    comentarioInputContainer: { flexDirection: "row", alignItems: "center", paddingTop: 10, borderTopWidth: 1, borderTopColor: '#eee' },
    inputComentario: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 25, padding: 10, paddingHorizontal: 15, marginRight: 8 },
    btnCerrar: { marginTop: 15, padding: 10, alignSelf: "center", backgroundColor: '#f5f5f5', borderRadius: 10 },
    btnCerrarTexto: { color: "#444", fontSize: 16, fontWeight: "600" },
});

export default ComentariosModal;