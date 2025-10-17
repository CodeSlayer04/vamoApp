// src/servicios/perfilServicios.js

import { db } from '../config/firebaseconfig'; 

import { 
    doc, 
    getDoc, 
    collection, 
    query, 
    where, 
    getDocs,
    updateDoc 
} from 'firebase/firestore'; 


//Usamos las mismas constantes de Cloudinary que en CrearPage.jsx
const CLOUDINARY_CLOUD_NAME = 'dtfmdf4iu'; 
const CLOUDINARY_UPLOAD_PRESET = 'Vamoapp_profiles'; 


/**
 * Obtiene los datos de perfil y las publicaciones de un usuario específico desde Firestore.
 */
export const obtenerDatosPerfil = async (userId) => {
    try {
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
            seguidores: perfilSnap.data().seguidores || 0,
            // Usamos 'siguiendo', que es el campo en tu BD
            seguidos: perfilSnap.data().siguiendo || 0, 
            // 'lugaresVisitados' no existe en la BD, se queda en 0 por defecto.
            lugaresVisitados: 0 
        };

        // 2. OBTENER LAS PUBLICACIONES DEL USUARIO (Colección 'publicaciones')
        const publicacionesRef = collection(db, "publicaciones");
        
        // 🛑 CORRECCIÓN CLAVE: El campo en Firestore es 'IdAutor', no 'autorId'
        const q = query(publicacionesRef, where("IdAutor", "==", userId));
        
        const publicacionesSnapshot = await getDocs(q);

        const listaPublicaciones = [];
        publicacionesSnapshot.forEach((doc) => {
            listaPublicaciones.push({
                id: doc.id,
                ...doc.data(),
                // Usamos 'FechaCreacion', que es el campo en tu BD
                fecha: doc.data().FechaCreacion?.toDate()?.toISOString() 
            });
        });
        
        datosPerfil.publicaciones = listaPublicaciones;
        datosPerfil.publicacionesCount = listaPublicaciones.length;
        
        return datosPerfil;

    } catch (error) {
        console.error("Error al obtener el perfil de Firebase:", error);
        throw new Error("Fallo en la comunicación con la base de datos.");
    }
};


/**
 * Actualiza la información del perfil del usuario usando Cloudinary para la foto.
 * (La lógica de actualización es correcta, se mantiene)
 */
export const actualizarPerfilUsuario = async (userId, datosActualizados) => {
    const perfilRef = doc(db, "usuarios", userId);
    let fotoUrlFinal = datosActualizados.fotoActual; 

    try {
        // 1. Lógica de subida a Cloudinary
        if (datosActualizados.nuevaFotoURI) {
            
            const formData = new FormData();
            
            formData.append('file', {
                uri: datosActualizados.nuevaFotoURI, 
                name: `${userId}_${Date.now()}.jpg`, 
                type: 'image/jpeg', 
            });
            
            formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
            
            const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

            const response = await fetch(uploadUrl, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(`Error en Cloudinary: ${data.error.message}`);
            }

            fotoUrlFinal = data.secure_url; 
        }

        // 2. Prepara los datos a actualizar en Firestore
        const updatePayload = {
            nombre: datosActualizados.nombre,
            biografia: datosActualizados.biografia,
            fotoPerfil: fotoUrlFinal, 
        };

        // 3. Actualiza el documento en Firestore
        await updateDoc(perfilRef, updatePayload);

    } catch (error) {
        console.error("Error al actualizar el perfil (Cloudinary/Firestore):", error);
        throw new Error(error.message || "No se pudo actualizar el perfil. Revisa tu conexión y configuración de Cloudinary.");
    }
};