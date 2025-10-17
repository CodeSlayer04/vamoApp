import React from "react";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import { lugares } from "../data/lugares";

export default function InformacionCategoriaPage() {
  const route = useRoute();
  const { categoria } = route.params;

  const lugaresFiltrados = lugares.filter((l) => l.categoria === categoria);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>{categoria}</Text>
      {lugaresFiltrados.map((lugar, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.title}>{lugar.nombre}</Text>
          <Image
            source={{ uri: lugar.imagen }}
            style={styles.image}
            resizeMode="cover"
          />
          <Text style={styles.description}>{lugar.descripcion}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 15 },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  image: { width: "100%", height: 200, borderRadius: 8, marginBottom: 10 },
  description: { fontSize: 15, color: "#555" },
});
