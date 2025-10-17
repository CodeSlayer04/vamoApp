// src/components/BotonSeguir.jsx

import React, { useState, useEffect } from "react";
import { Button, Alert, ActivityIndicator } from "react-native";
import {
  verificarSiSigue,
  seguirUsuario,
  dejarDeSeguirUsuario,
} from "../servicios/perfilServicios";

// 🛑 ACEPTAMOS LA PROP onFollowToggle
const BotonSeguir = ({ currentUserId, targetUserId, onFollowToggle }) => {
  // 1. Estado: Si el usuario logueado sigue al objetivo
  const [isFollowing, setIsFollowing] = useState(false); // Estado: Para deshabilitar el botón y mostrar el spinner durante la carga o la acción
  const [isLoading, setIsLoading] = useState(true); // 2. Efecto para verificar el estado de seguimiento inicial (al cargar la página)

  useEffect(() => {
    const checkFollowingStatus = async () => {
      if (!currentUserId || !targetUserId) {
        setIsLoading(false);
        return;
      }
      try {
        const following = await verificarSiSigue(currentUserId, targetUserId);
        setIsFollowing(following);
      } catch (error) {
        console.error("Error al verificar estado de seguimiento:", error);
      } finally {
        setIsLoading(false);
      }
    };
    checkFollowingStatus();
  }, [currentUserId, targetUserId]); // 3. Función que maneja el clic del botón

  const handleSeguir = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      if (isFollowing) {
        await dejarDeSeguirUsuario(currentUserId, targetUserId);
        setIsFollowing(false);
      } else {
        await seguirUsuario(currentUserId, targetUserId);
        setIsFollowing(true);
      }
      // 🛑 LLAMAMOS AL CALLBACK para forzar el refresco de la página padre
      if (onFollowToggle) {
        onFollowToggle();
      }
    } catch (error) {
      console.error("Error de seguimiento:", error);
      Alert.alert("Fallo de Acción", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <ActivityIndicator size="small" color="#4CAF50" />;
  } // 4. Renderiza el botón

  return (
    <Button
      title={isFollowing ? "Siguiendo" : "Seguir"}
      onPress={handleSeguir}
      color={isFollowing ? "#a0a0a0" : "#4CAF50"}
      disabled={isLoading}
    />
  );
};

export default BotonSeguir;
