import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function CategoriaHomePage() {
  const navigation = useNavigation();
  const route = useRoute();
  const { categoria } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{categoria}</Text>
      <Text style={styles.subtitle}>Selecciona una opción:</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate("InformacionCategoria", { categoria })
        }
      >
        <Text style={styles.buttonText}>Información</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => navigation.navigate("MapaCategoria", { categoria })}
      >
        <Text style={styles.buttonText}>Ver en mapa</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
  },
  button: {
    width: "80%",
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  secondaryButton: {
    backgroundColor: "#2E7D32",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
  },
});
