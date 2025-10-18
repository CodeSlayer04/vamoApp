import { useState, useEffect, useCallback } from 'react';
import { obtenerDatosPerfil } from '../servicios/perfilServicios';
import { auth } from '../config/firebaseconfig';

export const useObtenerPerfilUsuario = (targetUserId) => {
    const userId = targetUserId || (auth.currentUser ? auth.currentUser.uid : null);
    const [datosPerfil, setDatosPerfil] = useState(null);
    const [estaCargando, setEstaCargando] = useState(true);
    const [error, setError] = useState(null);
    
  
    const [refetchTrigger, setRefetchTrigger] = useState(0); 
    
    
    const recargarPerfil = useCallback(() => {
        setRefetchTrigger(prev => prev + 1);
    }, []);

    useEffect(() => {
        if (!userId) {
            setEstaCargando(false);
            return;
        }

        const fetchDatos = async () => {
            setEstaCargando(true);
            setError(null);
            try {
                const data = await obtenerDatosPerfil(userId);
                setDatosPerfil(data);
            } catch (err) {
                setError(err);
                console.error("Error en useObtenerPerfilUsuario:", err);
            } finally {
                setEstaCargando(false);
            }
        };

        fetchDatos();
    }, [userId, refetchTrigger]); 

    return { datosPerfil, estaCargando, error, recargarPerfil };
};