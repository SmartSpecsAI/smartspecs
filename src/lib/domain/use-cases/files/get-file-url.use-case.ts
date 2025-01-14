import { IFilesRepository } from "@/smartspecs/lib/domain/repositories";

export const GetFileUrlUseCase = (filesRepository: IFilesRepository) => ({
  async execute(path: string): Promise<string> {
    try {
      const url = await filesRepository.getFileUrl(path);
      return url;
    } catch (error) {
      console.error("Error getting file URL:", error);
      throw new Error("Failed to get file URL. Please try again later.");
    }
  },
});

export type IGetFileUrlUseCase = ReturnType<typeof GetFileUrlUseCase>;
