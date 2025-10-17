// src/hooks/useObtenerPerfilUsuario.js

import { useState, useEffect, useCallback } from 'react';
import { obtenerDatosPerfil } from '../servicios/perfilServicios';
import { auth } from '../config/firebaseconfig';

export const useObtenerPerfilUsuario = (targetUserId) => {
    const userId = targetUserId || (auth.currentUser ? auth.currentUser.uid : null);
    const [datosPerfil, setDatosPerfil] = useState(null);
    const [estaCargando, setEstaCargando] = useState(true);
    const [error, setError] = useState(null);
    
    //Estado para forzar la recarga
    const [refetchTrigger, setRefetchTrigger] = useState(0); 
    
    //Función expuesta para que la página pueda llamar a la recarga
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
    }, [userId, refetchTrigger]); // AGREGAMOS 'refetchTrigger' como dependencia

    return { datosPerfil, estaCargando, error, recargarPerfil }; //EXPORTAMOS la función
};