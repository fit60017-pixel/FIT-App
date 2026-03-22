import { GoogleGenAI, Type } from '@google/genai';
import { Product, User } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const generateFibResponse = async (query: string, context: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        systemInstruction: `You are FIB, a personal health assistant for the FIT Medical Wizard app. 
You are looking at a LIVE FEED of the FIT database.
CRITICAL RULES:
1. ONLY talk about products provided in the "Available Products" context. Never mention products not present in this list.
2. If a user asks for a product in "Recently Deleted Products", you MUST say: "This item was just removed from our marketplace".
3. If a product is out of stock (stock <= 0) or unavailable, inform the user and suggest the next best "Safe" alternative based on their health profile (Weight, Height, Allergies).
4. Strictly list prices and ingredients exactly as they appear in the Vendor's latest entry.
5. If a user asks for a product NOT in the list and NOT in the deleted list, say: "Sorry, this item is not in our local vendor list yet."
6. Use the user's Health Profile (Weight, Height, Allergies, Conditions) to provide personalized, safe advice.
7. Keep your answers concise, friendly, and helpful.

Current Live Context:
${context}`,
      },
    });
    return response.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("Error generating FIB response:", error);
    return "I'm having trouble connecting right now. Please try again later.";
  }
};

export const analyzeProductSafety = async (product: Product, user: User): Promise<{ verdict: 'Safe' | 'Caution' | 'Unsafe'; score: number; explanation: string }> => {
  try {
    const prompt = `
      Analyze the safety of this product for this user.
      
      User Profile:
      - Name: ${user.name}
      - Weight: ${user.healthProfile?.weight}kg
      - Height: ${user.healthProfile?.height}cm
      - Allergies: ${user.healthProfile?.allergies.join(', ')}
      - Chronic Diseases: ${user.healthProfile?.chronicDiseases.join(', ')}
      - Fitness Goals: ${user.healthProfile?.fitnessGoals}
      
      Product Details:
      - Name: ${product.name}
      - Brand: ${product.brand}
      - Ingredients: ${product.description}
      - Allergens: ${product.allergens.join(', ')}
      - Calories: ${product.calories}
      - Protein: ${product.protein}g
      - Carbs: ${product.carbs}g (Sugars: ${product.sugars}g, Fibers: ${product.fibers}g)
      - Fats: ${product.fats}g (Saturated: ${product.saturatedFats}g, Unsaturated: ${product.unsaturatedFats}g)
      - Tags: ${product.tags.join(', ')}
      
      Return a JSON object with:
      - verdict: "Safe", "Caution", or "Unsafe"
      - score: A percentage (0-100) representing how well it fits their profile.
      - explanation: A detailed one-sentence explanation like 'This snack is 80% safe for you because it fits your 170cm height and 84kg weight, but watch out for the added sugar'.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verdict: { type: Type.STRING, enum: ['Safe', 'Caution', 'Unsafe'] },
            score: { type: Type.NUMBER },
            explanation: { type: Type.STRING },
          },
          required: ['verdict', 'score', 'explanation'],
        },
      },
    });

    const result = JSON.parse(response.text || '{}');
    return {
      verdict: result.verdict || 'Caution',
      score: result.score || 50,
      explanation: result.explanation || 'Unable to provide detailed analysis at this time.',
    };
  } catch (error) {
    console.error("Error analyzing product safety:", error);
    return {
      verdict: 'Caution',
      score: 0,
      explanation: 'FIB is currently offline. Please check ingredients manually.',
    };
  }
};
