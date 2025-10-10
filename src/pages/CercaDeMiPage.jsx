import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";

const categorias = [
  {
    id: 1,
    nombre: "Sol y playa",
    imagen: "https://cdn-icons-png.flaticon.com/512/869/869869.png",
  },
  {
    id: 2,
    nombre: "Senderismo",
    imagen: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  },
  {
    id: 3,
    nombre: "Montañas",
    imagen: "https://cdn-icons-png.flaticon.com/512/4814/4814842.png",
  },
  {
    id: 4,
    nombre: "Cultura",
    imagen: "https://cdn-icons-png.flaticon.com/512/992/992651.png",
  },
];

export default function CercaDeMiPage() {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Lugares cerca de ti</Text>
      <Text style={styles.subtitle}>Elige una categoría para explorar en el mapa</Text>

      <View style={styles.grid}>
        {categorias.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={styles.card}
            onPress={() =>
              navigation.navigate("MapaCategoria", { categoria: cat.nombre })
            }
          >
            <Image source={{ uri: cat.imagen }} style={styles.image} />
            <Text style={styles.text}>{cat.nombre}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "47%",
    backgroundColor: "#f5f5f5",
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
});
