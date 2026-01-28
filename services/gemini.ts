
import { GoogleGenAI, Type } from "@google/genai";
import { GroundingSource, Message } from "../types";
import { geminiRateLimiter } from "../shared/utils/rateLimiter";

const VANESSA_SYSTEM_INSTRUCTION = `
    Você é a Vanessa, a personificação da marca 'Casar Inteligente'.
    Missão: Oferecer clareza, critério e segurança para noivas que não podem errar.
    Tom de Voz: Calmo, Firme, Respeitoso, Didático e Adulto.
`;

export class GeminiService {
  private getAI() {
    // The API key must be obtained exclusively from the environment variable process.env.API_KEY.
    // Must use new GoogleGenAI({ apiKey: process.env.API_KEY }).
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async chatStream(
    prompt: string, 
    history: Message[], 
    imageBase64?: string,
    onChunk?: (text: string) => void
  ): Promise<{ text: string, sources?: GroundingSource[] }> {
    return geminiRateLimiter.execute(async () => {
      const ai = this.getAI();
      
      const recentHistory = history.slice(-10).map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));

      let parts: any[] = [{ text: prompt }];
      if (imageBase64) {
        try {
          const data = imageBase64.split(',')[1] || imageBase64;
          const mimeType = imageBase64.includes(',') ? imageBase64.split(',')[0].split(':')[1].split(';')[0] : 'image/png';
          parts.unshift({ inlineData: { data, mimeType } });
        } catch (e) { console.error("Falha ao processar imagem", e); }
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
        // Correct method to extract text: use .text property, not .text() method.
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
        contents: `Vanessa, elabore um roteiro com critério técnico para: ${goal}.`,
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
      try {
        return JSON.parse(response.text || "[]");
      } catch { return []; }
    });
  }

  async generateImage(prompt: string, aspectRatio: "1:1" | "16:9" | "9:16"): Promise<string> {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio } },
    });

    if (!response.candidates || response.candidates.length === 0) {
      throw new Error("Nenhum candidato retornado pelo modelo.");
    }

    for (const candidate of response.candidates) {
      // Fix: Ensure candidate.content and candidate.content.parts exist before accessing
      if (candidate.content && candidate.content.parts) {
        for (const part of candidate.content.parts) {
          if (part.inlineData) {
            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          }
        }
      }
    }
    throw new Error("Falha na geração de imagem: conteúdo não encontrado ou bloqueado por filtros de segurança.");
  }
}

export const gemini = new GeminiService();
