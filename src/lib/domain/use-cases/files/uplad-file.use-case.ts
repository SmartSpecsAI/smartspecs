import { IFilesRepository } from "@/smartspecs/domain/repositories";

export const UploadFileUseCase = (filesRepository: IFilesRepository) => ({
  async execute(file: File, path: string): Promise<void> {
    try {
      await filesRepository.uploadFile(path, file);
    } catch (error) {
      console.error("Error uploading file:", error);
      throw new Error("Failed to upload file. Please try again later.");
    }
  },
});

export type IUploadFileUseCase = ReturnType<typeof UploadFileUseCase>;
