import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { lugares as lugaresLocales } from "../data/lugares";

// ⚡️ PON TU API KEY AQUÍ si quieres datos reales
const GOOGLE_API_KEY = ""; // Ej: "AIzaSyD-XXXXXXXXXXXXXXX"

export default function MapaCategoriaPage({ route }) {
  const { categoria } = route.params || { categoria: "Sin categoría" };

  const mapRef = useRef(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lugares, setLugares] = useState([]);

  // Función para mapear categorías a tipos de Google Places
  const categoriaToGoogleType = (cat) => {
    switch (cat) {
      case "Sol y playa": return "beach";
      case "Senderismo": return "park";
      case "Montañas": return "point_of_interest";
      case "Cultura": return "museum";
      case "Gastronomía": return "restaurant";
      case "Rural": return "tourist_attraction";
      default: return "point_of_interest";
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permiso denegado",
            "Activa el permiso de ubicación para ver el mapa."
          );
          setLoading(false);
          return;
        }

        const userLocation = await Location.getCurrentPositionAsync({});
        setLocation(userLocation.coords);

        if (GOOGLE_API_KEY) {
          // 🚀 Usar Google Places API
          const tipo = categoriaToGoogleType(categoria);
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${userLocation.coords.latitude},${userLocation.coords.longitude}&radius=10000&type=${tipo}&key=${GOOGLE_API_KEY}`
          );
          const data = await response.json();
          setLugares(data.results.map((l) => ({
            nombre: l.name,
            lat: l.geometry.location.lat,
            lng: l.geometry.location.lng,
          })));
        } else {
          // 🏡 Usar datos locales
          const filtrados = lugaresLocales.filter(l => l.categoria === categoria);
          setLugares(filtrados);
        }
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "No se pudo obtener tu ubicación o los lugares.");
      } finally {
        setLoading(false);
      }
    })();
  }, [categoria]);

  // Ajustar zoom para mostrar todos los marcadores
  useEffect(() => {
    if (mapRef.current && lugares.length > 0) {
      const coords = lugares.map((l) => ({
        latitude: l.lat,
        longitude: l.lng,
      }));
      mapRef.current.fitToCoordinates(coords, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  }, [lugares]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text>Cargando mapa...</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No se pudo acceder a la ubicación.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation={true}
      >
        {lugares.map((lugar, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: lugar.lat, longitude: lugar.lng }}
            title={lugar.nombre}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
