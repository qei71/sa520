
import { GoogleGenAI } from "@google/genai";

// Initialize GoogleGenAI strictly using process.env.API_KEY as per coding guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSmartFoodRecommendation = async (userPreferences: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Based on the user preferences: "${userPreferences}", recommend 2-3 types of authentic Italian dishes they might like. Be concise and friendly in Traditional Chinese. Assume the restaurant offers standard Italian fare like pasta, risotto, pizza, and seafood.`,
    });
    // Directly accessing the .text property from GenerateContentResponse
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "無法取得建議，歡迎參考我們的熱門菜色！";
  }
};
