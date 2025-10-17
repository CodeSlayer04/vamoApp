// src/hooks/useObtenerPerfilUsuario.js

import { useState, useEffect } from 'react';
import { obtenerDatosPerfil } from '../servicios/perfilServicios'; 


/**
 * Custom Hook para obtener los datos del perfil de un usuario desde Firebase.
 * @param {string} idUsuario - El ID único del usuario (uid).
 */
export const useObtenerPerfilUsuario = (idUsuario) => {
    const [datosPerfil, setDatosPerfil] = useState(null);
    const [estaCargando, setEstaCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // No intentes cargar si no hay ID (ej. usuario no autenticado)
        if (!idUsuario) {
            setDatosPerfil(null);
            setEstaCargando(false);
            return;
        }

        const cargarPerfil = async () => {
            setEstaCargando(true);
            setError(null);
            
            try {
                const datosUsuarioReal = await obtenerDatosPerfil(idUsuario);

                if (datosUsuarioReal) {
                    setDatosPerfil(datosUsuarioReal);
                } else {
                    // Esto ocurre si el documento no existe en la colección 'usuarios'
                    setError("Usuario no encontrado en la base de datos (Colección 'usuarios').");
                }
            } catch (err) {
                console.error("Error al cargar perfil:", err);
                setError("Error al conectar con el servidor. Inténtalo de nuevo.");
            } finally {
                setEstaCargando(false);
            }
        };

        cargarPerfil();

    }, [idUsuario]); 

    return { datosPerfil, estaCargando, error };
};