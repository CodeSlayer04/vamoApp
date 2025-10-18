import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

/**
 * Componente EncabezadoPerfil
 * @param {object} usuario 
 * @param {function} alEditar 
 * @param {boolean} esPerfilPropio 
 * * @param {JSX.Element} CustomButton 
 */
const EncabezadoPerfil = ({
  usuario,
  alEditar,
  esPerfilPropio = true,
  CustomButton,
}) => {
  
  const nombre = usuario?.nombre || "Usuario Desconocido";
  const biografia =
    usuario?.biografia || "Viajero principiante, en busca de nuevos sitios";

  const seguidores = usuario?.seguidores?.toLocaleString() || "0";
  const seguidos = usuario?.seguidos?.toLocaleString() || "0";
  const visitados = usuario?.lugaresVisitados?.toLocaleString() || "0";
  const fotoUrl =
    usuario?.fotoPerfil ||
    "https://cdn-icons-png.flaticon.com/512/11789/11789135.png";


  const textoBoton = esPerfilPropio ? "Editar Perfil" : "Seguir";
  const estiloBoton = esPerfilPropio ? styles.botonEditar : styles.botonSeguir;

  return (
    <View style={styles.contenedorPrincipal}>
      
      <View style={styles.filaSuperior}>
        <Image source={{ uri: fotoUrl }} style={styles.imagenPerfil} />

        {esPerfilPropio ? (
        
          <TouchableOpacity style={styles.botonEditar} onPress={alEditar}>
            <Text style={styles.textoBotonEditar}>Editar Perfil</Text>
          </TouchableOpacity>
        ) : (
        
          CustomButton
        )}
      </View>

      {/* Datos Personales */}
      <Text style={styles.textoNombre}>{nombre}</Text>
      <Text style={styles.textoBio}>{biografia}</Text>

      {/* Contenedor de Estadísticas */}
      <View style={styles.contenedorEstadisticas}>
        <View style={styles.itemEstadistica}>
          <Text style={styles.valorEstadistica}>{seguidores}</Text>
          <Text style={styles.etiquetaEstadistica}>Seguidores</Text>
        </View>
        <View style={styles.separadorVertical} />
        <View style={styles.itemEstadistica}>
          <Text style={styles.valorEstadistica}>{seguidos}</Text>
          <Text style={styles.etiquetaEstadistica}>Seguidos</Text>
        </View>
        <View style={styles.separadorVertical} />
        <View style={styles.itemEstadistica}>
          <Text style={styles.valorEstadistica}>{visitados}</Text>
          <Text style={styles.etiquetaEstadistica}>Visitados</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contenedorPrincipal: {
    padding: 20,
    backgroundColor: "#fff",
    paddingBottom: 10,
  },
  filaSuperior: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  imagenPerfil: { width: 100, height: 100, borderRadius: 50, borderWidth: 0 },
  botonEditar: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#f9f9f9",
  },
  botonSeguir: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  textoBotonEditar: { color: "#333", fontWeight: "600" },
  textoNombre: { fontSize: 22, fontWeight: "bold", marginBottom: 2 },
  textoBio: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
    fontStyle: "italic",
  },
  contenedorEstadisticas: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  itemEstadistica: { alignItems: "center", flex: 1 },
  valorEstadistica: { fontSize: 18, fontWeight: "bold", color: "#4CAF50" },
  etiquetaEstadistica: { fontSize: 12, color: "#666" },
  separadorVertical: {
    height: "80%",
    width: 1,
    backgroundColor: "#eee",
    alignSelf: "center",
  },
});

export default EncabezadoPerfil;
