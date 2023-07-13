// Import the functions you need from the SDKs you need
import { initializeApp } from "@firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth, GoogleAuthProvider } from "@firebase/auth";
import { getFirestore, collection, onSnapshot, doc, setDoc, deleteDoc, query, where, getDocs, getDoc, QueryDocumentSnapshot, DocumentData, QuerySnapshot, DocumentSnapshot, CollectionReference, Unsubscribe, QueryConstraint, DocumentReference, updateDoc, arrayUnion, FieldValue, orderBy } from '@firebase/firestore';
import { getStorage } from '@firebase/storage';
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
  const q = query(collectionRef);
  const querySnapshot = await getDocs(q);
  stateCallback(buildListFromFirestoreDocs<Type>(querySnapshot, mergeWithId));
}

export async function getCollection<Type>(collectionRef: CollectionReference<DocumentData>, stateCallback: (f) => void, orderByField?: string) {
  let q = query(collectionRef)
  if (orderByField) {
    q = query(collectionRef, orderBy('sorting'));
  }
  const querySnapshot = await getDocs(q);

  stateCallback(buildListFromFirestoreDocs<Type>(querySnapshot, mergeWithId));
}

/**
 * Gets a document from firestore database
 * @param documentRef The document reference
 * @param stateCallback The callback function which will be called when the data is fetched
 * @param fieldPath The field path which should be fetched
 */
export async function getDocument<Type>(documentRef: DocumentReference<DocumentData>, stateCallback: (f) => void, fieldPath: string) {
  const document = await getDoc(documentRef);
  if (document.exists() && document.get(fieldPath)) {
    stateCallback(JSON.parse(document.get(fieldPath)));
  }
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
* @returns {Type} Type
 */
export function mergeWithId(docSnap: QueryDocumentSnapshot<DocumentData>): any {
  return {id: docSnap.id, ...docSnap.data()};
}

/**
 * 
 * @param {QuerySnapshot<DocumentData>} queryResultReference 
 * @param {function} callback 
 * @returns {array} Array of object
 */
export function buildListFromFirestoreDocs<Type>(queryResultReference, callback:(doc: QueryDocumentSnapshot<DocumentData>) => Type): Type[] {
  return queryResultReference?.docs.map((doc) => callback(doc));
}

/**
 * Saves doc to firestore database
 * @param incomeRef 
 * @param data 
 * @returns 
 */
export async function saveDoc<Type>(docRef: DocumentReference<DocumentData>, data: Type): Promise<void> {
  await setDoc(docRef, data);
}

/**
 * Saves an array to the firestore database
 * @param docRef Reference to the firestore Document
 * @param key the key in which the data should be saved
 * @param data the data which should be updated
 */
export async function saveArray(docRef: DocumentReference<DocumentData>, key: string, data: string): Promise<void> {
  // Atomically add a new region to the "regions" array field.
  await updateDoc(docRef, {
    [`${key}`]: arrayUnion(data)
  });
}

/**
 * Deletes document from firestore Database
 * @param docRef 
 */
export async function removeDoc(docRef: DocumentReference<unknown>): Promise<void> {
  deleteDoc(docRef);
}