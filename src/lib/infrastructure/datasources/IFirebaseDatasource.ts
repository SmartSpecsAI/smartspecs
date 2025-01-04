export interface IFirebaseDatasource {
  getCollection(collectionName: string): Promise<any[]>;
  getDocument(collectionName: string, docId: string): Promise<any>;
  addDocument(collectionName: string, data: any): Promise<string>;
  updateDocument(
    collectionName: string,
    docId: string,
    data: any
  ): Promise<void>;
  deleteDocument(collectionName: string, docId: string): Promise<void>;
}
