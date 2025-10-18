
import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  getFirestore,
} from "firebase/firestore";
import app from "../config/firebaseconfig";

export const useObtenerTodasLasPublicaciones = () => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const auth = getAuth(app);
    const user = auth.currentUser;

    if (!user) {
      setError("Usuario no autenticado");
      setCargando(false);
      return;
    }

    const db = getFirestore(app);
    const publicacionesRef = collection(db, "publicaciones");
    const q = query(publicacionesRef, orderBy("FechaCreacion", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPublicaciones(lista);
        setCargando(false);
      },
      (err) => {
        console.error("Error al obtener publicaciones:", err);
        setError(err);
        setCargando(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { publicaciones, cargando, error };
};
