import { getInjection } from "@/smartspecs/di/container";
import { IFirebaseDatasource } from "@/smartspecs/lib/infrastructure";

export class FilesRepository {
  private readonly firebase: IFirebaseDatasource;

  constructor() {
    this.firebase = getInjection("IFirebaseDatasource");
  }

  async uploadFile(path: string, file: File): Promise<void> {
    await this.firebase.addFile(path, file);
  }

  async removeFile(path: string): Promise<void> {
    await this.firebase.removeFile(path);
  }

  async getFileUrl(path: string): Promise<string> {
    return await this.firebase.getFileUrl(path);
  }
}
