// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, doc, query, where, getDocs, QueryDocumentSnapshot, DocumentData, QuerySnapshot } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import Pot from '../models/Pot';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyApLQUvpPILyG1JUO59v4dCmivRvmLlI_0",
  authDomain: "moneypot-d6b3f.firebaseapp.com",
  projectId: "moneypot-d6b3f",
  storageBucket: "moneypot-d6b3f.appspot.com",
  messagingSenderId: "505611772415",
  appId: "1:505611772415:web:851e14adaeaab4619407ca",
  measurementId: "G-E5R411MM4P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
export const firestore = getFirestore(app);
export const storage = getStorage(app);


/**
 * Gets a users/{uid} document with username
 * @param {string} username 
 */
export async function getUserFromUsername(username: string) {
  const q = query(collection(firestore, "users"), where("username", "==", username));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs[0];
}

/**
 * 
 * @param {QueryDocumentSnapshot<DocumentData>} docSnap 
 * @returns {Pot} Pot
 */
export function mergeWithId<Type>(docSnap: QueryDocumentSnapshot<DocumentData>): Type {
  return {id: docSnap.id, ...docSnap.data()} as Type;
}

/**
 * 
 * @param {QuerySnapshot<DocumentData>} queryResultReference 
 * @param {function} callback 
 * @returns {array} Array of object
 */
export function buildListFromFirestoreDocs<Type>(queryResultReference: QuerySnapshot<DocumentData>, callback:(doc: QueryDocumentSnapshot<DocumentData>) => Type): Type[] {
  return queryResultReference?.docs.map((doc) => callback(doc));
}