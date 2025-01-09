import OpenAI from "openai";
import { IOpenAIDatasource } from "@/smartspecs/infrastructure";

export class OpenAIDatasource implements IOpenAIDatasource {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });
  }

  async executePrompt(prompt: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      if (!response.choices[0].message?.content) {
        throw new Error("No response generated");
      }

      return response.choices[0].message.content;
    } catch (error) {
      console.error("Error generating text:", error);
      throw new Error("Failed to generate text");
    }
  }

  async transcribeAudio(audioFile: File): Promise<string> {
    try {
      const transcription = await this.openai.audio.transcriptions.create({
        file: audioFile,
        model: "whisper-1",
      });

      return transcription.text;
    } catch (error) {
      console.error("Error transcribing audio:", error);
      throw new Error("Failed to transcribe audio");
    }
  }
}
