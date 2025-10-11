import React, { useState, useEffect } from "react";
import { View, Text, Button, Image, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function CrearPage() {
  const [image, setImage] = useState(null);

  // Pedir permisos al iniciar
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

  // Abrir cámara
  const openCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear publicación</Text>
      <Button title="Abrir cámara" onPress={openCamera} />
      {image && <Image source={{ uri: image }} style={styles.preview} />}
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
});
