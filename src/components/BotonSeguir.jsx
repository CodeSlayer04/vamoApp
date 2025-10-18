// src/components/BotonSeguir.jsx

import React, { useState, useEffect } from "react";
import { Button, Alert, ActivityIndicator } from "react-native";
import {
  verificarSiSigue,
  seguirUsuario,
  dejarDeSeguirUsuario,
} from "../servicios/perfilServicios";


const BotonSeguir = ({ currentUserId, targetUserId, onFollowToggle }) => {
 
  const [isFollowing, setIsFollowing] = useState(false); 
  const [isLoading, setIsLoading] = useState(true); 

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
  }, [currentUserId, targetUserId]); 

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
  } 

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
