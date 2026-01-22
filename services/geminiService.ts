import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
// Initialize only if key exists to avoid errors, though the app will handle missing keys gracefully in UI
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateProductDescription = async (name: string, category: string): Promise<string> => {
  if (!ai) {
    throw new Error("API Key not configured");
  }

  try {
    const model = ai.models;
    const prompt = `Write a professional, concise (max 2 sentences) product description for a product named "${name}" in the category "${category}". Highlight key selling points.`;

    const response = await model.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "No description generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate description");
  }
};

export const analyzeStockAction = async (productName: string, stock: number, minStock: number): Promise<string> => {
    if (!ai) return "AI insights unavailable.";
    
    try {
        const model = ai.models;
        const prompt = `
          Product: ${productName}
          Current Stock: ${stock}
          Minimum Threshold: ${minStock}
          
          Give a very short (max 10 words) action advice like "Restock immediately" or "Stock levels healthy".
        `;
        
        const response = await model.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });
        return response.text || "No advice.";
    } catch (e) {
        return "Analysis failed.";
    }
}