export interface IOpenAIDatasource {
  executePrompt(prompt: string): Promise<string>;
  transcribeAudio(audioFile: File): Promise<string>;
}
