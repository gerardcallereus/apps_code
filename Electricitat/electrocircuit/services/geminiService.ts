import { GoogleGenAI, Type } from "@google/genai";
import { CIRCUIT_ELEMENTS } from "../constants";
import { AnalysisResult } from "../types";

const SYSTEM_INSTRUCTION = `
Ets un expert en electrònica i simbologia de circuits segons l'estàndard internacional (IEC).
La teva tasca és identificar quin símbol electrònic apareix a la imatge proporcionada.
La imatge pot ser un esquema digital o un dibuix fet a mà en paper.

Has d'identificar si la imatge conté un dels següents elements:
${CIRCUIT_ELEMENTS.map(e => `- ${e.name} (ID: ${e.id})`).join('\n')}

Retorna la resposta en format JSON.
`;

export const identifySymbolFromImage = async (base64Data: string): Promise<AnalysisResult> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key missing");

    const ai = new GoogleGenAI({ apiKey });
    
    // Using gemini-3-flash-preview for multimodal tasks (image input -> text output)
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Data
            }
          },
          {
            text: "Quin símbol electrònic és aquest? Analitza'l visualment."
          }
        ]
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            elementId: {
              type: Type.STRING,
              description: "L'ID de l'element identificat, o string buit/null si no està clar.",
              nullable: true
            },
            confidence: {
              type: Type.NUMBER,
              description: "Un número entre 0 i 1 indicant la seguretat."
            },
            explanation: {
              type: Type.STRING,
              description: "Una frase curta en català explicant per què has identificat aquest element."
            }
          },
          required: ["confidence", "explanation"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text);
    
    return {
      elementId: result.elementId || null,
      confidence: result.confidence,
      explanation: result.explanation
    };

  } catch (error) {
    console.error("Error identifying symbol:", error);
    return {
      elementId: null,
      confidence: 0,
      explanation: "Hi ha hagut un error connectant amb la IA. Torna-ho a provar."
    };
  }
};
