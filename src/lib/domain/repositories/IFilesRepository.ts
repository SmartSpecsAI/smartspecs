export interface IFilesRepository {
  uploadFile(path: string, file: File): Promise<void>;
  removeFile(path: string): Promise<void>;
}
