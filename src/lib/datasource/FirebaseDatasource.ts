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
  DocumentReference,
  DocumentData,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, deleteObject } from "firebase/storage";

export class FirebaseDatasource implements IFirebaseDatasource {
  private db;
  private storage;

  constructor() {
    this.db = getFirestore(firebase);
    this.storage = getStorage(firebase);
  }

  async getCollection(
    collectionName: string,
    reference?: DocumentReference<DocumentData>
  ) {
    const collectionRef = reference
      ? collection(reference, collectionName)
      : collection(this.db, collectionName);

    const querySnapshot = await getDocs(collectionRef);
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

  getDocumentReference(
    collectionName: string,
    docId: string
  ): DocumentReference<DocumentData> {
    return doc(this.db, collectionName, docId);
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

  async addFile(path: string, file: File) {
    const storageRef = ref(this.storage, path);
    await uploadBytes(storageRef, file);
  }

  async removeFile(path: string) {
    const storageRef = ref(this.storage, path);
    await deleteObject(storageRef);
  }
}
