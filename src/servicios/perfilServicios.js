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
const CLOUDINARY_UPLOAD_PRESET = 'Vamoapp_upload'; 


/**
 * Obtiene los datos de perfil (Mantenida sin cambios)
 */
export const obtenerDatosPerfil = async (userId) => {
    // ... (Tu lógica de obtención de datos de perfil va aquí, no se modifica)
    try {
        const perfilRef = doc(db, "usuarios", userId);
        // ... (El resto del código obtenerDatosPerfil)
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
            seguidos: perfilSnap.data().siguiendo || 0,
            lugaresVisitados: 0 
        };

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
 */
export const actualizarPerfilUsuario = async (userId, datosActualizados) => {
    const perfilRef = doc(db, "usuarios", userId);
    let fotoUrlFinal = datosActualizados.fotoActual; 

    try {
        // 1. Lógica de subida a Cloudinary
        if (datosActualizados.nuevaFotoURI) {
            
            const formData = new FormData();
            
            // Adjuntamos la imagen (URI local) como file
            formData.append('file', {
                uri: datosActualizados.nuevaFotoURI, 
                name: `${userId}_${Date.now()}.jpg`, 
                type: 'image/jpeg', 
            });
            
            // Adjuntamos el preset de subida
            formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
            
            const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

            // Realizamos la petición POST
            const response = await fetch(uploadUrl, {
                method: 'POST',
                body: formData,
                headers: {
                    // Nota: 'Content-Type': 'multipart/form-data' es a veces necesario
                    // pero 'fetch' en RN lo maneja automáticamente con FormData.
                },
            });

            const data = await response.json();

            if (data.error) {
                // Si Cloudinary devuelve un error, lo lanzamos
                throw new Error(`Error en Cloudinary: ${data.error.message}`);
            }

            fotoUrlFinal = data.secure_url; // La URL segura proporcionada por Cloudinary
            console.log("Nueva foto subida a Cloudinary. URL:", fotoUrlFinal);
        }

        // 2. Prepara los datos a actualizar en Firestore
        const updatePayload = {
            nombre: datosActualizados.nombre,
            biografia: datosActualizados.biografia,
            fotoPerfil: fotoUrlFinal, 
        };

        // 3. Actualiza el documento en Firestore
        await updateDoc(perfilRef, updatePayload);
        console.log("Perfil de usuario actualizado exitosamente en Firestore.");

    } catch (error) {
        // Propagamos el error para que la página de edición lo muestre
        console.error("Error al actualizar el perfil (Cloudinary/Firestore):", error);
        throw new Error(error.message || "No se pudo actualizar el perfil. Revisa tu conexión y configuración de Cloudinary.");
    }
};