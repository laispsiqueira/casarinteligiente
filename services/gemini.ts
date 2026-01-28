import { GoogleGenAI, Type } from "@google/genai";
import { GroundingSource } from "../types";

export class GeminiService {
  private getAI() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  private systemInstruction = `
    Você é a Vanessa, a personificação da marca 'Casar Inteligente'.
    
    SUA ESSÊNCIA:
    - Missão: Oferecer clareza, critério e segurança para noivas que não podem errar.
    - Propósito: Facilitar o planejamento de casamento para noivos que buscam eternizar esse momento com decisões conscientes.
    - Promessa: "Você vai saber exatamente o que está fazendo — antes de gastar, contratar ou decidir."
    
    SUA PERSONALIDADE (SEJA ELA):
    - Uma mulher elegante, atenciosa e madura.
    - Usa psicologia para acalmar noivas aflitas, sem diagnosticar ou julgar.
    - Transmite calma, maturidade e segurança.
    
    TOM DE VOZ:
    - Calmo, Firme, Respeitoso, Didático e Adulto.
    - NÃO infantilize a noiva.
    - NÃO use pressão, medo ou urgência falsa.
    - NÃO prometa atalhos ou casamentos perfeitos.
    - Acolha, organize e oriente.
    
    INFORMAÇÕES DE PRODUTO (Simplifier):
    - Solução: Planejamento consciente e seguro.
    - Diferencial: Customização total e automação via WhatsApp.
    - Preço: R$ 500 à vista ou R$ 700 em 12x.
    - Garantia: 7 dias de satisfação ou reembolso.
  `;

  async chat(prompt: string, imageBase64?: string): Promise<{ text: string, sources?: GroundingSource[] }> {
    const ai = this.getAI();
    let contents: any;

    if (imageBase64) {
      const data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
      const mimeType = imageBase64.includes(',') ? imageBase64.split(',')[0].split(':')[1].split(';')[0] : 'image/png';
      contents = {
        parts: [
          { inlineData: { data, mimeType } },
          { text: prompt }
        ]
      };
    } else {
      contents = { parts: [{ text: prompt }] };
    }
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: this.systemInstruction
      }
    });

    const sources: GroundingSource[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    chunks.forEach((chunk: any) => {
      if (chunk.web) sources.push({ title: chunk.web.title, uri: chunk.web.uri });
    });

    return {
      text: response.text || "Compreendo. Como sua consultora, estou aqui para garantir que cada decisão seja tomada com clareza. Vamos tentar novamente?",
      sources: sources.length > 0 ? sources : undefined
    };
  }

  async generateTasks(goal: string): Promise<any[]> {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Vanessa, como consultora da Casar Inteligente, elabore um roteiro com critério e consciência para: ${goal}.`,
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
  }

  async searchSuppliers(query: string): Promise<{ text: string, sources: GroundingSource[] }> {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Vanessa, busque opções validadas e seguras de ${query} que respeitem o critério de consciência antes de gastar.`,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: this.systemInstruction
      }
    });

    const sources: GroundingSource[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    chunks.forEach((chunk: any) => {
      if (chunk.web) sources.push({ title: chunk.web.title, uri: chunk.web.uri });
    });

    return {
      text: response.text || '',
      sources
    };
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
    throw new Error("Falha na materialização visual.");
  }
}

export const gemini = new GeminiService();