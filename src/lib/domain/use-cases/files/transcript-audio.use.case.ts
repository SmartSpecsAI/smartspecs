import { IFilesRepository } from "@/smartspecs/domain/repositories";

export const TranscriptAudioUseCase = (filesRepository: IFilesRepository) => ({
  async execute(file: File): Promise<string> {
    try {
      const transcription = await filesRepository.transcribeAudioFile(file);
      return transcription;
    } catch (error) {
      console.error("Error transcribing audio:", error);
      throw new Error("Failed to transcribe audio. Please try again later.");
    }
  },
});

export type ITranscriptAudioUseCase = ReturnType<typeof TranscriptAudioUseCase>;
