import { getInjection } from "@/di/container";
import { IFirebaseDatasource } from "@/smartspecs/infrastructure";

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
}
