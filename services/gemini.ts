
import { GoogleGenAI, Type } from "@google/genai";
import { GroundingSource, Message } from "../types";
import { config } from "../core/config/env";
import { geminiRateLimiter } from "../shared/utils/rateLimiter";

const VANESSA_SYSTEM_INSTRUCTION = `
    Você é a Vanessa, a personificação da marca 'Casar Inteligente'.
    Missão: Oferecer clareza, critério e segurança para noivas que não podem errar.
    Tom de Voz: Calmo, Firme, Respeitoso, Didático e Adulto.
`;

export class GeminiService {
  private getAI() {
    // Always use named parameter for apiKey and ensure it uses process.env.API_KEY
    return new GoogleGenAI({ apiKey: config.gemini.apiKey });
  }

  async chatStream(
    prompt: string, 
    history: Message[], 
    imageBase64?: string,
    onChunk?: (text: string) => void
  ): Promise<{ text: string, sources?: GroundingSource[] }> {
    return geminiRateLimiter.execute(async () => {
      const ai = this.getAI();
      
      const recentHistory = history.slice(-6).map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));

      let parts: any[] = [{ text: prompt }];
      if (imageBase64) {
        const data = imageBase64.split(',')[1] || imageBase64;
        const mimeType = imageBase64.includes(',') ? imageBase64.split(',')[0].split(':')[1].split(';')[0] : 'image/png';
        parts.unshift({ inlineData: { data, mimeType } });
      }

      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-3-flash-preview',
        contents: [...recentHistory, { role: 'user', parts }],
        config: {
          tools: [{ googleSearch: {} }],
          systemInstruction: VANESSA_SYSTEM_INSTRUCTION
        }
      });

      let fullText = '';
      let sources: GroundingSource[] = [];

      for await (const chunk of responseStream) {
        // Use .text property, not .text() method
        const textChunk = chunk.text || '';
        fullText += textChunk;
        if (onChunk) onChunk(fullText);
        
        const chunks = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        chunks.forEach((c: any) => {
          if (c.web && !sources.find(s => s.uri === c.web.uri)) {
            sources.push({ title: c.web.title, uri: c.web.uri });
          }
        });
      }

      return { text: fullText, sources: sources.length > 0 ? sources : undefined };
    });
  }

  // Implementation of missing searchSuppliers method using Google Search Grounding
  async searchSuppliers(query: string): Promise<{ text: string, sources: GroundingSource[] }> {
    return geminiRateLimiter.execute(async () => {
      const ai = this.getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Vanessa, busque fornecedores qualificados e confiáveis para: ${query}. Forneça uma análise criteriosa de tom profissional.`,
        config: {
          tools: [{ googleSearch: {} }],
          systemInstruction: VANESSA_SYSTEM_INSTRUCTION
        }
      });

      // Use .text property, not .text() method
      const text = response.text || '';
      const sources: GroundingSource[] = [];
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      
      chunks.forEach((c: any) => {
        if (c.web && !sources.find(s => s.uri === c.web.uri)) {
          sources.push({ title: c.web.title, uri: c.web.uri });
        }
      });

      return { text, sources };
    });
  }

  async generateTasks(goal: string): Promise<any[]> {
    return geminiRateLimiter.execute(async () => {
      const ai = this.getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Vanessa, como consultora, elabore um roteiro com critério para: ${goal}.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                category: { type: Type.STRING }
              },
              required: ["title", "category"]
            }
          },
          systemInstruction: VANESSA_SYSTEM_INSTRUCTION
        }
      });
      // Use .text property, not .text() method
      return JSON.parse(response.text || "[]");
    });
  }

  async generateImage(prompt: string, aspectRatio: "1:1" | "16:9" | "9:16"): Promise<string> {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio } },
    });

    // Iterate through all candidates and parts to find the image data
    for (const candidate of response.candidates || []) {
      for (const part of candidate.content.parts || []) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    throw new Error("Falha na geração.");
  }
}

export const gemini = new GeminiService();
