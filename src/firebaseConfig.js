// ════════════════════════════════════════════════
// firebaseConfig.js
// Configuración de conexión a Firebase — ContaQuiz
// ════════════════════════════════════════════════
//
// Este archivo centraliza la conexión a Firebase.
// Impórtalo en cualquier componente que necesite
// autenticación o base de datos.
//
// Instalación previa necesaria (en tu proyecto local):
//   npm install firebase
//
// ════════════════════════════════════════════════

import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
  increment,
  arrayUnion,
} from "firebase/firestore";

// ────────────────────────────────────────────────
// 🔑 Credenciales del proyecto ContaQuiz (Firebase)
// ────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyBv2jSiaqrV4mC97zo11u_jRs-m7oB5A54",
  authDomain: "contaquiz-60320.firebaseapp.com",
  projectId: "contaquiz-60320",
  storageBucket: "contaquiz-60320.firebasestorage.app",
  messagingSenderId: "93106177981",
  appId: "1:93106177981:web:78501d1877743d0cbef4d4",
  measurementId: "G-RWYYYGYWQE",
};

// ────────────────────────────────────────────────
// Inicialización de servicios
// ────────────────────────────────────────────────
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Analytics solo funciona en navegador (no en SSR) — se activa de forma segura
export let analytics = null;
isSupported().then((ok) => {
  if (ok) analytics = getAnalytics(app);
});

// ════════════════════════════════════════════════
// 🔐 FUNCIONES DE AUTENTICACIÓN
// ════════════════════════════════════════════════

/**
 * Registra un nuevo usuario con correo y contraseña,
 * y crea su documento de perfil en Firestore.
 */
export async function registrarUsuario({ nombre, email, password }) {
  const credencial = await createUserWithEmailAndPassword(auth, email, password);
  const usuario = credencial.user;

  await updateProfile(usuario, { displayName: nombre });

  // Crear documento de perfil en la colección "usuarios"
  await setDoc(doc(db, "usuarios", usuario.uid), {
    nombre,
    email,
    esPremium: false,
    plan: null, // "mensual" | "anual" | null
    fechaRegistro: serverTimestamp(),
    puntajeTotal: 0,
    preguntasGratisUsadas: 0,
    insignias: [],
    progresoPorModulo: {}, // { "1": { respondidas: 0, correctas: 0 }, ... }
  });

  return usuario;
}

/** Inicia sesión con correo y contraseña. */
export async function iniciarSesion({ email, password }) {
  const credencial = await signInWithEmailAndPassword(auth, email, password);
  return credencial.user;
}

/** Cierra la sesión actual. */
export async function cerrarSesion() {
  await signOut(auth);
}

/**
 * Suscribe un callback a los cambios de sesión.
 * Úsalo en el componente raíz para saber si hay
 * un usuario autenticado o no (incluye persistencia
 * automática entre recargas de página).
 */
export function escucharSesion(callback) {
  return onAuthStateChanged(auth, callback);
}

// ════════════════════════════════════════════════
// 👤 PERFIL DE USUARIO / PROGRESO
// ════════════════════════════════════════════════

/** Obtiene el documento de perfil del usuario desde Firestore. */
export async function obtenerPerfil(uid) {
  const ref = doc(db, "usuarios", uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

/** Incrementa el contador de preguntas gratis usadas (modo freemium). */
export async function incrementarPreguntasGratis(uid) {
  const ref = doc(db, "usuarios", uid);
  await updateDoc(ref, { preguntasGratisUsadas: increment(1) });
}

/** Suma puntaje, actualiza progreso del módulo y guarda insignia si corresponde. */
export async function registrarResultadoQuiz(uid, { temaId, puntaje, correctas, total, insignia }) {
  const ref = doc(db, "usuarios", uid);
  const datosActualizados = {
    puntajeTotal: increment(puntaje),
    [`progresoPorModulo.${temaId}.respondidas`]: increment(total),
    [`progresoPorModulo.${temaId}.correctas`]: increment(correctas),
  };
  if (insignia) {
    datosActualizados.insignias = arrayUnion(insignia);
  }
  await updateDoc(ref, datosActualizados);
}

/** Activa el plan premium del usuario tras un pago exitoso (PayPal / Binance Pay). */
export async function activarPremium(uid, { plan, metodoPago, referenciaPago }) {
  const ref = doc(db, "usuarios", uid);
  await updateDoc(ref, {
    esPremium: true,
    plan, // "mensual" | "anual"
    metodoPago, // "paypal" | "binance_pay"
    referenciaPago,
    fechaActivacionPremium: serverTimestamp(),
  });
}

// ════════════════════════════════════════════════
// 🏆 RANKING GLOBAL
// ════════════════════════════════════════════════

/** Obtiene el top N de usuarios ordenados por puntaje total. */
export async function obtenerRankingGlobal(topN = 20) {
  const ref = collection(db, "usuarios");
  const q = query(ref, orderBy("puntajeTotal", "desc"), limit(topN));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
}

// ════════════════════════════════════════════════
// 📋 BANCO DE PREGUNTAS (colección "preguntas")
// ════════════════════════════════════════════════
//
// Estructura sugerida en Firestore:
// preguntas/{preguntaId} = {
//   temaId: 1-5,
//   tipo: "multiple" | "vf" | "caso",
//   dificultad: "básico" | "intermedio" | "avanzado",
//   estado: "aprobada" | "revisar" | "borrador",
//   texto: "...",
//   opciones: ["...", "...", "...", "..."],
//   correcta: 0-3,
// }

/** Obtiene todas las preguntas APROBADAS de un módulo específico. */
export async function obtenerPreguntasPorModulo(temaId) {
  const ref = collection(db, "preguntas");
  const q = query(ref); // el filtrado fino se hace en el admin; aquí traemos todo el módulo
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((p) => p.temaId === temaId && p.estado === "aprobada");
}

/** Crea o actualiza una pregunta (usado desde el Panel de Superusuario). */
export async function guardarPregunta(pregunta) {
  const id = pregunta.id || crypto.randomUUID();
  await setDoc(doc(db, "preguntas", id), { ...pregunta, id }, { merge: true });
  return id;
}
