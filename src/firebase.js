import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, setDoc, writeBatch } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAUI6vhKXXO7Hpxjxx72xH_iLsdh-1LNQo",
  authDomain: "social-tracker360.firebaseapp.com",
  projectId: "social-tracker360",
  storageBucket: "social-tracker360.firebasestorage.app",
  messagingSenderId: "182243011028",
  appId: "1:182243011028:web:a410604502b81dfa6b8e41"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ============ SANCIONES CNBV ============
export const getSanciones = async () => {
  const q = query(collection(db, "sanciones_cnbv"), orderBy("fechaImposicion", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addSancion = async (data) => {
  const docRef = await addDoc(collection(db, "sanciones_cnbv"), data);
  return { id: docRef.id, ...data };
};

export const addSancionesBatch = async (sanciones) => {
  const batch = writeBatch(db);
  sanciones.forEach(sancion => {
    const docRef = doc(collection(db, "sanciones_cnbv"));
    batch.set(docRef, sancion);
  });
  await batch.commit();
};

export const deleteSancion = async (id) => {
  const docRef = doc(db, "sanciones_cnbv", id);
  await deleteDoc(docRef);
};

export { db };
