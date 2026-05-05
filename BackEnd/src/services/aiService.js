import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

export async function generatePlayerBiography(playerName) {
    if (!process.env.GEMINI_API_KEY) {
        console.warn("⚠️ GEMINI_API_KEY is not set. Skipping biography generation.");
        return "";
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `Write a compelling 2-paragraph cricket career summary for the player "${playerName}". Focus on their journey, major achievements, and playing style. Keep it professional and engaging, similar to a Cricbuzz profile.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error(`❌ Error generating biography for ${playerName}:`, error.message);
        return "";
    }
}

/**
 * Generic Gemini text generation utility.
 * @param {string} prompt - The main prompt text.
 * @param {string} systemInstruction - Optional system-level instruction.
 * @returns {string} The generated text response.
 */
export async function generateWithGemini(prompt, systemInstruction = "") {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not configured.");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        ...(systemInstruction && { systemInstruction }),
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
}

