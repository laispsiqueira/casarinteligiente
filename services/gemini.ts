
import { GoogleGenAI, Type } from "@google/genai";
import { GroundingSource, Message } from "../types";
import { geminiRateLimiter } from "../shared/utils/rateLimiter";

const SYSTEM_INSTRUCTION = `
    Você é a Vanessa, a personificação da marca 'Casar Inteligente'.
    Missão: Oferecer clareza, critério e segurança para noivas que não podem errar.
    Tom de Voz: Calmo, Firme, Respeitoso, Didático e Adulto.
    Capacidades Multimodais: Descrição de imagens e transcrição de áudios.
`;

/**
 * GeminiService encapsula a comunicação com os modelos da Google.
 * Segue princípios de responsabilidade única para chamadas de IA.
 */
export class GeminiService {
  private static instance: GeminiService;

  private constructor() {}

  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  // Helper to obtain a fresh GoogleGenAI instance for each call.
  // This ensures compliance with guidelines regarding API key updates.
  private get ai(): GoogleGenAI {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  private async callWithLimiter<T>(fn: () => Promise<T>): Promise<T> {
    return geminiRateLimiter.execute(fn);
  }

  async chatStream(
    prompt: string, 
    history: Message[], 
    imageBase64?: string,
    audioBase64?: string,
    onChunk?: (text: string) => void
  ): Promise<{ text: string, sources?: GroundingSource[] }> {
    return this.callWithLimiter(async () => {
      const recentHistory = history.slice(-10).map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));

      const parts: any[] = [{ text: prompt || "Analise o conteúdo enviado." }];
      
      if (imageBase64) {
        const data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
        const mimeType = imageBase64.includes(',') ? imageBase64.split(',')[0].split(':')[1].split(';')[0] : 'image/png';
        parts.push({ inlineData: { data, mimeType } });
      }

      if (audioBase64) {
        const data = audioBase64.includes(',') ? audioBase64.split(',')[1] : audioBase64;
        const mimeType = audioBase64.includes(',') ? audioBase64.split(',')[0].split(':')[1].split(';')[0] : 'audio/mp3';
        parts.push({ inlineData: { data, mimeType } });
      }

      const responseStream = await this.ai.models.generateContentStream({
        model: 'gemini-3-flash-preview',
        contents: [...recentHistory, { role: 'user', parts }],
        config: { tools: [{ googleSearch: {} }], systemInstruction: SYSTEM_INSTRUCTION }
      });

      let fullText = '';
      let sources: GroundingSource[] = [];

      for await (const chunk of responseStream) {
        fullText += chunk.text || '';
        if (onChunk) onChunk(fullText);
        
        const metadata = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        metadata.forEach((c: any) => {
          if (c.web && !sources.some(s => s.uri === c.web.uri)) {
            sources.push({ title: c.web.title, uri: c.web.uri });
          }
        });
      }

      return { text: fullText, sources: sources.length > 0 ? sources : undefined };
    });
  }

  async extractTasks(history: Message[]): Promise<any[]> {
    return this.callWithLimiter(async () => {
      const conversation = history.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n');
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Extraia tarefas concretas da conversa:\n${conversation}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: { title: { type: Type.STRING }, category: { type: Type.STRING } },
              required: ["title", "category"]
            }
          },
          systemInstruction: SYSTEM_INSTRUCTION
        }
      });
      return JSON.parse(response.text || "[]");
    });
  }

  async generateImage(prompt: string, aspectRatio: "1:1" | "16:9" | "9:16"): Promise<string> {
    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio } },
    });
    const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    if (!part?.inlineData) throw new Error("Falha na geração");
    return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
  }

  async searchSuppliers(query: string): Promise<{ text: string, sources: GroundingSource[] }> {
    return this.callWithLimiter(async () => {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Busque fornecedores para: ${query}`,
        config: { tools: [{ googleSearch: {} }], systemInstruction: SYSTEM_INSTRUCTION }
      });
      const text = response.text || '';
      const sources: GroundingSource[] = [];
      (response.candidates?.[0]?.groundingMetadata?.groundingChunks || []).forEach((c: any) => {
        if (c.web && !sources.some(s => s.uri === c.web.uri)) sources.push({ title: c.web.title, uri: c.web.uri });
      });
      return { text, sources };
    });
  }
}

export const gemini = GeminiService.getInstance();
