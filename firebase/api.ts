import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  query, 
  orderBy, 
  serverTimestamp,
  OrderByDirection
} from "firebase/firestore";
import { db, auth } from "./config";

/**
 * Enhanced Error Logging
 */
const logFirebaseError = (operation: string, path: string, error: any) => {
  const currentUser = auth.currentUser;
  const isAuth = !!currentUser;
  console.group(`[Firebase API Error] Operation: ${operation} | Path: ${path}`);
  console.error(`Status: ${isAuth ? 'Authenticated' : 'Unauthenticated'}`);
  if (isAuth) {
    console.error(`User ID: ${currentUser.uid}`);
    console.error(`Email: ${currentUser.email}`);
  }
  console.error(`Error Message: ${error.message}`);
  console.error(`Full Error Object:`, error);
  console.groupEnd();
};

// Generic Collection Access
export const getCollection = async <T,>(collectionName: string): Promise<T[]> => {
  try {
    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) return [];
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as T));
  } catch (error) {
    logFirebaseError('getCollection', collectionName, error);
    return [];
  }
};

export const getOrderedCollection = async <T,>(
  collectionName: string, 
  field: string = 'createdAt', 
  direction: OrderByDirection = 'asc'
): Promise<T[]> => {
  try {
    const colRef = collection(db, collectionName);
    const q = query(colRef, orderBy(field, direction));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return [];
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as T));
  } catch (error: any) {
    console.warn(`Ordering failed for ${collectionName}. Falling back to basic fetch.`);
    return getCollection<T>(collectionName);
  }
};

// Singleton Document Access
export const getSingleDoc = async <T,>(collectionName: string, docId: string): Promise<T | null> => {
  try {
    const docRef = doc(db, collectionName, docId);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as T;
    }
    return null;
  } catch (error) {
    logFirebaseError('getSingleDoc', `${collectionName}/${docId}`, error);
    return null;
  }
};

export const updateSingleDoc = async (collectionName: string, docId: string, data: any) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
  } catch (error) {
    logFirebaseError('updateSingleDoc', `${collectionName}/${docId}`, error);
    throw error;
  }
};

// CRUD Operations
export const createDoc = async <T,>(collectionName: string, data: any): Promise<string> => {
  try {
    const colRef = collection(db, collectionName);
    const docRef = await addDoc(colRef, {
      ...data,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    logFirebaseError('createDoc', collectionName, error);
    throw error;
  }
};

export const updateExistingDoc = async (collectionName: string, docId: string, data: any) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
  } catch (error) {
    logFirebaseError('updateExistingDoc', `${collectionName}/${docId}`, error);
    throw error;
  }
};

export const removeDoc = async (collectionName: string, docId: string) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
  } catch (error) {
    logFirebaseError('removeDoc', `${collectionName}/${docId}`, error);
    throw error;
  }
};