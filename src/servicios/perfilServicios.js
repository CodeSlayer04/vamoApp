// src/servicios/perfilServicios.js

import { db } from "../config/firebaseconfig";

import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  // 🛑 TODAS LAS IMPORTACIONES CONSOLIDADAS Y AGREGADAS
  documentId,
  arrayUnion,
  arrayRemove,
  writeBatch,
  increment,
} from "firebase/firestore";

//Usamos las mismas constantes de Cloudinary que en CrearPage.jsx
const CLOUDINARY_CLOUD_NAME = "dtfmdf4iu";
const CLOUDINARY_UPLOAD_PRESET = "Vamoapp_upload";

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
      seguidos: perfilSnap.data().siguiendo || 0,
      lugaresVisitados: 0,
    }; // OBTENER LAS PUBLICACIONES DEL USUARIO

    const publicacionesRef = collection(db, "publicaciones");
    const q = query(publicacionesRef, where("IdAutor", "==", userId));
    const publicacionesSnapshot = await getDocs(q);

    const listaPublicaciones = [];
    publicacionesSnapshot.forEach((doc) => {
      listaPublicaciones.push({
        id: doc.id,
        ...doc.data(),
        fecha: doc.data().FechaCreacion?.toDate()?.toISOString(),
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
 * Actualiza la información del perfil del usuario (Edición de perfil).
 */
export const actualizarPerfilUsuario = async (userId, datosActualizados) => {
  const perfilRef = doc(db, "usuarios", userId);
  let fotoUrlFinal = datosActualizados.fotoActual;

  try {
    // 1. Lógica de subida a Cloudinary... (Omitida por brevedad, asumimos que funciona)
    if (datosActualizados.nuevaFotoURI) {
      // Lógica de Cloudinary
      const formData = new FormData();
      formData.append("file", {
        uri: datosActualizados.nuevaFotoURI,
        name: `${userId}_${Date.now()}.jpg`,
        type: "image/jpeg",
      });
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (data.error) {
        throw new Error(`Error en Cloudinary: ${data.error.message}`);
      }
      fotoUrlFinal = data.secure_url;
    } // 2. Actualiza el documento en Firestore

    const updatePayload = {
      nombre: datosActualizados.nombre,
      biografia: datosActualizados.biografia,
      fotoPerfil: fotoUrlFinal,
    };
    await updateDoc(perfilRef, updatePayload);
  } catch (error) {
    console.error(
      "Error al actualizar el perfil (Cloudinary/Firestore):",
      error
    );
    throw new Error(
      error.message ||
        "No se pudo actualizar el perfil. Revisa tu conexión y configuración de Cloudinary."
    );
  }
};

/**
 * Obtiene una lista de usuarios de Firestore, excluyendo al usuario actual.
 */
export const obtenerListaUsuarios = async (currentUserId) => {
  try {
    const usuariosRef = collection(db, "usuarios");
    const q = query(usuariosRef, where(documentId(), "!=", currentUserId));
    const snapshot = await getDocs(q);
    const listaUsuarios = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return listaUsuarios;
  } catch (error) {
    console.error(
      "Error al obtener la lista de usuarios para sugerencias:",
      error
    );
    return [];
  }
};

// =======================================================
// 🛑 LÓGICA DE SEGUIMIENTO (AÑADIDA)
// =======================================================

/**
 * Verifica si el currentUserId sigue al targetUserId.
 */
export const verificarSiSigue = async (currentUserId, targetUserId) => {
  try {
    const userRef = doc(db, "usuarios", currentUserId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return false;
    }

    // Asumimos que la lista de IDs está en el campo 'siguiendoIDs'
    const siguiendoIDs = userSnap.data().siguiendoIDs || [];
    return siguiendoIDs.includes(targetUserId);
  } catch (error) {
    console.error("Error al verificar seguimiento:", error);
    return false;
  }
};

/**
 * Inicia el seguimiento. Usa una transacción (writeBatch) para actualizar dos documentos.
 */
export const seguirUsuario = async (currentUserId, targetUserId) => {
  if (!currentUserId || !targetUserId || currentUserId === targetUserId) return;

  const batch = writeBatch(db);

  const currentUserRef = doc(db, "usuarios", currentUserId);
  const targetUserRef = doc(db, "usuarios", targetUserId);

  batch.set(currentUserRef, {
    siguiendoIDs: arrayUnion(targetUserId),
    siguiendo: increment(1)
  }, { merge: true });

  batch.set(targetUserRef, {
    seguidoresIDs: arrayUnion(currentUserId),
    seguidores: increment(1)
  }, { merge: true });

  try {
    await batch.commit();
    console.log("Seguimiento exitoso");
  } catch (error) {
    console.error("Error en la transacción de SEGUIMIENTO:", error.code, error.message);
    throw new Error("Fallo al intentar seguir al usuario. Revisa las reglas de Firestore o la existencia de los documentos.");
  }
};

/**
 * Deja de seguir a un usuario. Usa una transacción para revertir los cambios.
 */
export const dejarDeSeguirUsuario = async (currentUserId, targetUserId) => {
  if (currentUserId === targetUserId) return;

  const batch = writeBatch(db);

  // 1. Actualizar el documento del usuario actual (el que deja de seguir)
  const currentUserRef = doc(db, "usuarios", currentUserId);
  batch.update(currentUserRef, {
    siguiendoIDs: arrayRemove(targetUserId), // Remueve el ID de la lista
    siguiendo: increment(-1), // -1 al contador
  });

  // 2. Actualizar el documento del usuario objetivo (el que es dejado de seguir)
  const targetUserRef = doc(db, "usuarios", targetUserId);
  batch.update(targetUserRef, {
    seguidoresIDs: arrayRemove(currentUserId), // Remueve el ID de la lista
    seguidores: increment(-1), // -1 al contador
  });

  try {
    await batch.commit();
  } catch (error) {
    console.error("Error en la transacción de DEJAR DE SEGUIR:", error);
    throw new Error(
      "Fallo al intentar dejar de seguir al usuario. Revisa las reglas de Firestore."
    );
  }
};
