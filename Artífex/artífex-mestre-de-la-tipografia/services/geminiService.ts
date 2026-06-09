import { GoogleGenAI, Type } from "@google/genai";
import { BrandAnalysis, AIAnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeBrandTypography = async (brandData: BrandAnalysis): Promise<AIAnalysisResult> => {
  try {
    const prompt = `
      Ets un expert en disseny gràfic i branding, parlant amb estudiants de 2n d'ESO (13-14 anys).
      Estan creant una marca de joieria.
      
      Dades de la marca de l'alumne:
      - Nom: ${brandData.name}
      - Públic objectiu: ${brandData.target}
      - El que vol transmetre (Vibe): ${brandData.vibe}

      Tasca:
      1. Recomana quina categoria tipogràfica (Serifa, Pal Sec, Manuscrita, o Decorativa) s'ajusta millor.
      2. Explica PER QUÈ d'una forma senzilla i encoratjadora, centrant-te en les emocions que transmet la lletra.
      3. Dona un consell breu sobre com utilitzar-la (ex: "Fes-la servir només pel títol").

      Respon en format JSON amb els camps: "suggestion" (text breu), "reasoning" (explicació adaptada a l'edat), "recommendedFontCategory" (nom de la categoria).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestion: { type: Type.STRING },
            reasoning: { type: Type.STRING },
            recommendedFontCategory: { type: Type.STRING }
          },
          required: ["suggestion", "reasoning", "recommendedFontCategory"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AIAnalysisResult;

  } catch (error) {
    console.error("Error analyzing brand:", error);
    return {
      suggestion: "Hi ha hagut un petit error connectant amb el cervell creatiu.",
      reasoning: "Torna-ho a provar en uns segons. Assegura't d'haver escrit bé les dades.",
      recommendedFontCategory: "Desconegut"
    };
  }
};