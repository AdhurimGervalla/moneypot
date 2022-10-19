// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, onSnapshot, doc, setDoc, deleteDoc, query, where, getDocs, getDoc, QueryDocumentSnapshot, DocumentData, QuerySnapshot, DocumentSnapshot, CollectionReference, Unsubscribe, QueryConstraint, DocumentReference } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { Dispatch, SetStateAction } from "react";

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

export async function getDocById(docName: string, docId: string): Promise<DocumentSnapshot<DocumentData>> {
  const docRef = doc(firestore, docName, docId);
  const docSnap = await getDoc(docRef);
  return docSnap;
}

export async function getCollectionById<Type>(collectionRef: CollectionReference<DocumentData>, stateCallback: (f) => void, constraints?: QueryConstraint) {
  console.log('start one time read');
  const q = query(collectionRef);
  const querySnapshot = await getDocs(q);
  console.log('one time read done');
  stateCallback(buildListFromFirestoreDocs<Type>(querySnapshot, mergeWithId));
}

/**
 * 
 * @param collectionRef 
 * @param callback 
 * @param constraints 
 * @returns 
 */
export function getSnapshotFromCollection<Type>(collectionRef: CollectionReference<DocumentData>, stateCallback: (f) => void, constraints?: QueryConstraint): Unsubscribe {
  const q = query(collectionRef);
  return onSnapshot(q, (querySnapshot) => {
      stateCallback(buildListFromFirestoreDocs<Type>(querySnapshot, mergeWithId));
  });

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

/**
 * Saves doc to firestore database
 * @param incomeRef 
 * @param data 
 * @returns 
 */
export async function saveDoc<Type>(docRef: CollectionReference<DocumentData>, data: Type): Promise<void> {
  setDoc(doc(docRef), data);
}

/**
 * Deletes document from firestore Database
 * @param docRef 
 */
export async function removeDoc(docRef: DocumentReference<unknown>): Promise<void> {
  deleteDoc(docRef);
}