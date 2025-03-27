import { IFirebaseDatasource } from "@/smartspecs/lib/infrastructure";
import { firebase } from "@/smartspecs/lib/config";
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
  CollectionReference,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, deleteObject } from "firebase/storage";

const storageBucket = `gs://smartspecs57b.firebasestorage.app`;
export class FirebaseDatasource implements IFirebaseDatasource {
  private db;
  private storage;

  constructor() {
    this.db = getFirestore(firebase);
    this.storage = getStorage(firebase, storageBucket);
  }

  async getCollection(
    collectionName: string,
    reference?: DocumentReference<DocumentData>
  ): Promise<Object[]> {
    const collectionRef = reference
      ? collection(reference, collectionName)
      : collection(this.db, collectionName);

    const querySnapshot = await getDocs(collectionRef);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  async getDocument(collectionName: string, docId: string): Promise<Object> {
    const docRef = doc(this.db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    return {
      exists: docSnap.exists(),
      id: docSnap.id,
      data: () => docSnap.data(),
    };
  }

  async getDocumentReference(
    collectionName: string,
    docId: string
  ): Promise<DocumentReference<DocumentData>> {
    return doc(this.db, collectionName, docId);
  }

  async getCollectionReference(
    collectionName: string,
    reference?: DocumentReference<DocumentData>
  ): Promise<CollectionReference<DocumentData>> {
    return reference
      ? collection(reference, collectionName)
      : collection(this.db, collectionName);
  }

  async addDocument(collectionName: string, data: any): Promise<string> {
    const collectionRef = collection(this.db, collectionName);

    const docRef = await addDoc(collectionRef, data);
    return docRef.id;
  }

  async addDocumentToDocumentCollection(
    documentRef: DocumentReference<DocumentData>,
    collectionName: string,
    data: Object
  ): Promise<string> {
    const collectionRef = collection(documentRef, collectionName);

    const docRef = await addDoc(collectionRef, data);
    return docRef.id;
  }

  async updateDocument(
    collectionName: string,
    docId: string,
    data: any
  ): Promise<void> {
    const docRef = doc(this.db, collectionName, docId);
    await updateDoc(docRef, data);
  }

  async updateDocumentByCollection(
    collection: CollectionReference<DocumentData, DocumentData>,
    docId: string,
    data: any
  ): Promise<void> {
    console.log("collection:::", collection);
    const docRef = doc(collection, docId);
    await updateDoc(docRef, data);
  }

  async deleteDocument(collectionName: string, docId: string): Promise<void> {
    const docRef = doc(this.db, collectionName, docId);
    await deleteDoc(docRef);
  }

  async addFile(path: string, file: File): Promise<void> {
    const storageRef = ref(this.storage, path);
    await uploadBytes(storageRef, file);
  }

  async removeFile(path: string): Promise<void> {
    const storageRef = ref(this.storage, path);
    await deleteObject(storageRef);
  }

  async getFileUrl(path: string): Promise<string> {
    return `https://firebasestorage.googleapis.com/v0/b/smartspecs57b.firebasestorage.app/o/${path}?alt=media`;
  }
}
