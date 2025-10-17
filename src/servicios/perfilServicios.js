// src/servicios/perfilServicios.js

import { db } from '../config/firebaseconfig'; 
import { 
    doc, 
    getDoc, 
    collection, 
    query, 
    where, 
    getDocs 
} from 'firebase/firestore'; 

/**
 * Obtiene los datos de perfil y las publicaciones de un usuario específico desde Firestore.
 * @param {string} userId - El ID único del usuario (uid de Firebase Auth).
 * @returns {Promise<object|null>} Los datos del perfil, incluyendo las publicaciones.
 */
export const obtenerDatosPerfil = async (userId) => {
    try {
        // 1. OBTENER DATOS PRINCIPALES DEL PERFIL (Colección 'usuarios')
        const perfilRef = doc(db, "usuarios", userId);
        const perfilSnap = await getDoc(perfilRef);

        if (!perfilSnap.exists()) {
            console.warn(`Usuario con ID ${userId} no encontrado en Firestore.`);
            return null;
        }

        let datosPerfil = {
            id: perfilSnap.id,
            ...perfilSnap.data(),
            publicaciones: [],
            publicacionesCount: 0,
            // Asume que 'seguidores' y 'seguidos' están en el documento
            seguidores: perfilSnap.data().seguidores || 0,
            seguidos: perfilSnap.data().siguiendo || 0, // Usamos 'siguiendo' de tu BD
            lugaresVisitados: 0 // Asumiremos 0 hasta implementar la lógica de conteo
        };

        // 2. OBTENER LAS PUBLICACIONES DEL USUARIO (Colección 'publicaciones')
        const publicacionesRef = collection(db, "publicaciones");
        const q = query(publicacionesRef, where("autorId", "==", userId));
        const publicacionesSnapshot = await getDocs(q);

        const listaPublicaciones = [];
        publicacionesSnapshot.forEach((doc) => {
            listaPublicaciones.push({
                id: doc.id,
                ...doc.data(),
                fecha: doc.data().fechaPublicacion?.toDate()?.toISOString() 
            });
        });
        
        // 3. ACTUALIZAR LOS CONTADORES
        datosPerfil.publicaciones = listaPublicaciones;
        datosPerfil.publicacionesCount = listaPublicaciones.length;
        
        return datosPerfil;

    } catch (error) {
        console.error("Error al obtener el perfil de Firebase:", error);
        throw new Error("Fallo en la comunicación con la base de datos.");
    }
};



//¨**********************************************************************************

