import {
  CollectionReference,
  DocumentData,
  DocumentReference,
} from "firebase/firestore";

export interface IFirebaseDatasource {
  getCollection(
    collectionName: string,
    reference?: DocumentReference<DocumentData>
  ): Promise<any[]>;
  getDocument(collectionName: string, docId: string): Promise<any>;
  getDocumentReference(
    collectionName: string,
    docId: string
  ): Promise<DocumentReference<DocumentData>>;
  getCollectionReference(
    collectionName: string,
    reference?: DocumentReference<DocumentData>
  ): Promise<CollectionReference<DocumentData>>;
  addDocument(collection: string, data: any): Promise<string>;
  addDocumentToDocumentCollection(
    documentRef: DocumentReference<DocumentData>,
    collectionName: string,
    data: any
  ): Promise<string>;
  updateDocument(
    collectionName: string,
    docId: string,
    data: any
  ): Promise<void>;
  updateDocumentByCollection(
    collection: CollectionReference<DocumentData, DocumentData>,
    docId: string,
    data: any
  ): Promise<void>;
  deleteDocument(collectionName: string, docId: string): Promise<void>;
  addFile(path: string, file: File): Promise<void>;
  removeFile(path: string): Promise<void>;
  getFileUrl(path: string): Promise<string>;
}
