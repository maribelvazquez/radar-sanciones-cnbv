// ============================================
// CONFIGURACIÓN DE FIREBASE
// ============================================
// INSTRUCCIONES:
// 1. Ve a console.firebase.google.com
// 2. Crea un proyecto o usa uno existente
// 3. En Configuración del proyecto > Tus apps > Web
// 4. Copia los valores de firebaseConfig aquí abajo
// ============================================

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// TODO: Reemplaza estos valores con los de tu proyecto Firebase
const firebaseConfig = {
  apiKey: "TU_API_KEY_AQUI",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
export const db = getFirestore(app);

export default app;
