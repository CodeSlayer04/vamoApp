
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const TarjetaPublicacion = ({ publicacion }) => {

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(publicacion.likes || 0);


  const [modalVisible, setModalVisible] = useState(false);
  const [comentarios, setComentarios] = useState(publicacion.comentarios || []);
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

  
    const nuevo = { id: Date.now().toString(), texto };
    setComentarios([...comentarios, nuevo]);
    setNuevoComentario("");
  };


  const navigation = useNavigation();
  const navegarADetalle = () => {
    navigation.navigate("DetallePublicacion", {
      idPublicacion: publicacion.id,
    });
    console.log(`Navegando al detalle del post: ${publicacion.id}`);
  };

  return (
    <>

      <TouchableOpacity style={styles.contenedor} onPress={navegarADetalle}>
        <Image
          source={{ uri: publicacion.imagenUrl }}
          style={styles.imagenPublicacion}
        />

        <View style={styles.infoInferior}>
          <Text style={styles.textoPublicacion}>{publicacion.texto}</Text>

          <View style={styles.contenedorEstadisticas}>
  
            <TouchableOpacity onPress={DarLike} style={styles.likeContainer}>
              <Ionicons
                name={isLiked ? "heart" : "heart-outline"}
                size={24}
                color={isLiked ? "red" : "black"}
              />
              <Text style={styles.contadorLikes}>{likeCount}</Text>
            </TouchableOpacity>

  
            <TouchableOpacity
              onPress={toggleComentarios}
              style={{ marginLeft: 15 }}
            >
              <Ionicons
                name="chatbox-ellipses-outline"
                size={24}
                color="black"
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>

 
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleComentarios}
      >
        <TouchableWithoutFeedback onPress={toggleComentarios}>
          <View style={styles.modalOverlay}>
     
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitulo}>Comentarios</Text>

             
                <FlatList
                  data={comentarios}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <View style={styles.comentarioItem}>
                      <Text style={styles.comentarioTexto}>• {item.texto}</Text>
                    </View>
                  )}
                  ListEmptyComponent={
                    <Text style={{ color: "#666", fontStyle: "italic" }}>
                      Sé el primero en comentar
                    </Text>
                  }
                />

             
                <KeyboardAvoidingView
                  behavior={Platform.OS === "ios" ? "padding" : "height"}
                  style={styles.comentarioInputContainer}
                >
                  <TextInput
                    style={styles.inputComentario}
                    placeholder="Escribe un comentario..."
                    value={nuevoComentario}
                    onChangeText={setNuevoComentario}
                  />
                  <Button title="Enviar" onPress={agregarComentario} />
                </KeyboardAvoidingView>

              
                <TouchableOpacity
                  onPress={toggleComentarios}
                  style={styles.btnCerrar}
                >
                  <Text style={styles.btnCerrarTexto}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#eee",
  },
  imagenPublicacion: {
    width: "100%",
    height: 200,
  },
  infoInferior: {
    padding: 10,
  },
  textoPublicacion: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  contenedorEstadisticas: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 5,
  },
  likeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  contadorLikes: {
    fontSize: 16,
    marginLeft: 6,
    color: "#444",
    fontWeight: "500",
  },
  // Modal y comentarios
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    height: "75%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  comentarioItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  comentarioTexto: {
    fontSize: 15,
    color: "#444",
  },
  comentarioInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 8,
  },
  inputComentario: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
  },
  btnCerrar: {
    marginTop: 15,
    alignSelf: "center",
  },
  btnCerrarTexto: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default TarjetaPublicacion;



