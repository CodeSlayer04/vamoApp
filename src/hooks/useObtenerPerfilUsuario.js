// src/hooks/useObtenerPerfilUsuario.js

import { useState, useEffect } from 'react';
// Importamos los datos simulados:
import mockUsuarios from '../data/usuarios.json'; 

/**
 * Custom Hook para simular la obtención de los datos del perfil de un usuario.
 * @param {string} idUsuario - El ID único del usuario a buscar.
 */
export const useObtenerPerfilUsuario = (idUsuario) => {
    const [datosPerfil, setDatosPerfil] = useState(null);
    const [estaCargando, setEstaCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setEstaCargando(true);
        setError(null);

        // 1. Simulación de la llamada a la API
        const datosUsuario = mockUsuarios[idUsuario]; 

        // 2. Simulación de tiempo de carga (2 segundos)
        setTimeout(() => {
            if (datosUsuario) {
                setDatosPerfil(datosUsuario);
            } else {
                setError("Usuario no encontrado en la base de datos simulada.");
            }
            setEstaCargando(false);
        }, 2000); // 2 segundos para simular la latencia de red

    }, [idUsuario]); // Se re-ejecuta si el ID de usuario cambia

    return { datosPerfil, estaCargando, error };
};