
import { GoogleGenAI } from "@google/genai";
import { TradeRecord } from "../types";

export const analyzeTrades = async (trades: TradeRecord[], query: string) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key is missing");

  const ai = new GoogleGenAI({ apiKey });
  
  const tradesContext = trades.map(t => ({
    date: t.date,
    symbol: t.symbol,
    strategy: t.strategy,
    pnl: t.netPnL,
    result: t.result,
    remarks: t.remarks
  }));

  const prompt = `
    You are an expert trading mentor. I am sharing my recent trade data with you.
    Recent Trades Data: ${JSON.stringify(tradesContext)}
    
    User Query: ${query}
    
    Instructions:
    1. Analyze my performance patterns.
    2. Suggest improvements for my strategies.
    3. Identify if I'm emotional based on my remarks.
    4. Be critical but constructive.
    5. Use the provided data to back up your reasoning.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 }
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to analyze trades. Check console for details.";
  }
};
