export interface IFilesRepository {
  uploadFile(path: string, file: File): Promise<void>;
  removeFile(path: string): Promise<void>;
  transcribeAudioFile(file: File): Promise<string>;
  getFileUrl(path: string): Promise<string>;
}
