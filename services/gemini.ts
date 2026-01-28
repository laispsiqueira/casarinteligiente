
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { GroundingSource, Message } from "../types";

export class GeminiService {
  private getAI() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  private systemInstruction = `
    Você é a Vanessa, a personificação da marca 'Casar Inteligente'.
    Missão: Oferecer clareza, critério e segurança para noivas que não podem errar.
    Tom de Voz: Calmo, Firme, Respeitoso, Didático e Adulto.
    Regra de Ouro: "Você vai saber exatamente o que está fazendo — antes de gastar, contratar ou decidir."
    Preço do Simplifier: R$ 500 à vista ou R$ 700 em 12x.
  `;

  // Novo método para streaming
  async chatStream(
    prompt: string, 
    history: Message[], 
    imageBase64?: string,
    onChunk?: (text: string) => void
  ): Promise<{ text: string, sources?: GroundingSource[] }> {
    const ai = this.getAI();
    
    // Gestão de Histórico (Sliding Window - últimas 6 mensagens)
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
        systemInstruction: this.systemInstruction
      }
    });

    let fullText = '';
    let sources: GroundingSource[] = [];

    for await (const chunk of responseStream) {
      const textChunk = chunk.text || '';
      fullText += textChunk;
      if (onChunk) onChunk(fullText);
      
      // Captura fontes apenas no último chunk ou se disponíveis
      const chunks = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      chunks.forEach((c: any) => {
        if (c.web && !sources.find(s => s.uri === c.web.uri)) {
          sources.push({ title: c.web.title, uri: c.web.uri });
        }
      });
    }

    return { text: fullText, sources: sources.length > 0 ? sources : undefined };
  }

  async generateTasks(goal: string): Promise<any[]> {
    const ai = this.getAI();
    try {
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
          systemInstruction: this.systemInstruction
        }
      });
      return JSON.parse(response.text || "[]");
    } catch (e) {
      console.error("Erro no parsing de tarefas:", e);
      return [];
    }
  }

  async searchSuppliers(query: string): Promise<{ text: string, sources: GroundingSource[] }> {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Vanessa, busque opções de ${query} com critério de consciência.`,
      config: {
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 1000 }, // Otimização Arquiteto: Habilitado raciocínio profundo
        systemInstruction: this.systemInstruction
      }
    });

    const sources: GroundingSource[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    chunks.forEach((chunk: any) => {
      if (chunk.web) sources.push({ title: chunk.web.title, uri: chunk.web.uri });
    });

    return { text: response.text || '', sources };
  }

  async generateImage(prompt: string, aspectRatio: "1:1" | "16:9" | "9:16"): Promise<string> {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio } },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
    throw new Error("Falha na geração.");
  }

  // Mantendo a assinatura legada para compatibilidade se necessário, 
  // mas recomendando chatStream
  async chat(prompt: string, imageBase64?: string) {
    return this.chatStream(prompt, [], imageBase64);
  }
}

export const gemini = new GeminiService();
