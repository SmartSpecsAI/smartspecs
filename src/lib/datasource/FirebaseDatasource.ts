import { IFirebaseDatasource } from "@/lib/infrastructure";
import { firebase } from "@/smartspecs/config";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";

export class FirebaseDatasource implements IFirebaseDatasource {
  private db;

  constructor() {
    this.db = getFirestore(firebase);
  }

  async getCollection(collectionName: string) {
    const querySnapshot = await getDocs(collection(this.db, collectionName));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  async getDocument(collectionName: string, docId: string) {
    const docRef = doc(this.db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    return {
      exists: docSnap.exists(),
      id: docSnap.id,
      data: () => docSnap.data(),
    };
  }

  async addDocument(collectionName: string, data: any) {
    const docRef = await addDoc(collection(this.db, collectionName), data);
    return docRef.id;
  }

  async updateDocument(collectionName: string, docId: string, data: any) {
    const docRef = doc(this.db, collectionName, docId);
    await updateDoc(docRef, data);
  }

  async deleteDocument(collectionName: string, docId: string) {
    const docRef = doc(this.db, collectionName, docId);
    await deleteDoc(docRef);
  }
}
