import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const explainContrast = async (bg: string, fg: string, ratio: number): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        Actua com un professor expert en disseny UX i accessibilitat web.
        Analitza breument aquesta combinació de colors:
        Fons: ${bg}
        Text: ${fg}
        Ràtio de contrast: ${ratio}:1.

        Explica a un alumne per què aquesta combinació és bona o dolenta per a la llegibilitat.
        Si és dolenta, suggereix com millorar-la (ex: "fes el fons més fosc").
        Sigues concís (màxim 2 frases) i encoratjador. Respon en Català.
      `,
    });
    return response.text || "No s'ha pogut generar l'explicació.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error connectant amb l'assistent IA.";
  }
};

export const analyzeQuizMistake = async (questionContext: string, bg: string, fg: string, userGuessedGood: boolean): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        L'usuari ha fallat una pregunta en un test d'accessibilitat de colors.
        Context de la imatge: "${questionContext}".
        Colors: Fons ${bg}, Text ${fg}.
        L'usuari creia que era ${userGuessedGood ? "BO" : "DOLENT"}, però la realitat és la contrària.

        Dona una explicació curta i didàctica de per què s'ha equivocat. Respon en Català.
      `,
    });
    return response.text || "Revisa la teoria del contrast.";
  } catch (error) {
    console.error(error);
    return "Error analitzant la resposta.";
  }
};
