import { getInjection } from "@/smartspecs/di/container";
import {
  IFirebaseDatasource,
  IOpenAIDatasource,
} from "@/smartspecs/lib/infrastructure";

export class FilesRepository {
  private readonly firebase: IFirebaseDatasource;
  private readonly openai: IOpenAIDatasource;

  constructor() {
    this.firebase = getInjection("IFirebaseDatasource");
    this.openai = getInjection("IOpenAIDatasource");
  }

  async uploadFile(path: string, file: File): Promise<void> {
    await this.firebase.addFile(path, file);
  }

  async removeFile(path: string): Promise<void> {
    await this.firebase.removeFile(path);
  }

  async transcribeAudioFile(file: File): Promise<string> {
    return await this.openai.transcribeAudio(file);
  }

  async getFileUrl(path: string): Promise<string> {
    return await this.firebase.getFileUrl(path);
  }

  async transcribeAudioFile(file: File): Promise<string> {
    return await this.openai.transcribeAudio(file);
  }
}
