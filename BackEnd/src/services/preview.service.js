import { Match } from '../models/match.models.js';
import { generateWithGemini } from './aiService.js';

export async function generateMatchPreview(matchId) {
    try {
        const match = await Match.findOne({ matchId });
        if (!match) throw new Error("Match not found");

        // If preview already exists, return it from DB cache
        if (match.previewData && match.previewData.pitchReport) {
            console.log(`Returning cached preview for match ${matchId}`);
            return match.previewData;
        }

        console.log(`Generating AI Preview for match ${matchId}...`);

        // Prepare context for the AI
        const team1 = match.teams?.[0] || 'Team A';
        const team2 = match.teams?.[1] || 'Team B';
        const venue = match.venue || 'Unknown Venue';
        
        let squadContext = '';
        if (match.squads && match.squads.length === 2) {
            squadContext += `\n${team1} Squad:\n`;
            match.squads[0].players.forEach(p => { squadContext += `- ${p.name} (${p.role || 'Unknown'})\n`; });
            squadContext += `\n${team2} Squad:\n`;
            match.squads[1].players.forEach(p => { squadContext += `- ${p.name} (${p.role || 'Unknown'})\n`; });
        } else {
            squadContext = "Squads not announced yet. Use general team knowledge.";
        }

        const prompt = `
You are an expert Fantasy Cricket Analyst. I need a comprehensive match preview for an upcoming T20 cricket match.

Match Details:
Teams: ${team1} vs ${team2}
Venue: ${venue}

Available Squads:
${squadContext}

Based on the venue and the players, generate a structured JSON response with the following keys exactly:
{
  "pitchReport": "A 2-3 sentence analysis of the pitch at this venue (e.g., batting friendly, spin-friendly, average score).",
  "weatherCondition": "A short prediction of typical weather for this venue.",
  "topPicks": [
    { "name": "Player Name 1", "reason": "Why they are a good pick (1 sentence)" },
    { "name": "Player Name 2", "reason": "Why they are a good pick (1 sentence)" },
    { "name": "Player Name 3", "reason": "Why they are a good pick (1 sentence)" }
  ],
  "fantasyTips": [
    "Tip 1 (e.g., Pick more death bowlers)",
    "Tip 2"
  ]
}

Return ONLY valid JSON. Do not use markdown blocks. Ensure the "name" in topPicks exactly matches a name from the provided squads if possible.
`;

        const responseText = await generateWithGemini(prompt, "You are a cricket data API that returns only valid JSON.");
        
        // Clean JSON formatting if Gemini returns markdown code blocks
        let cleanJson = responseText.trim();
        if (cleanJson.startsWith('```json')) cleanJson = cleanJson.substring(7);
        if (cleanJson.startsWith('```')) cleanJson = cleanJson.substring(3);
        if (cleanJson.endsWith('```')) cleanJson = cleanJson.substring(0, cleanJson.length - 3);
        
        const previewData = JSON.parse(cleanJson);

        // Cache it in the database
        match.previewData = previewData;
        await match.save();

        return previewData;

    } catch (error) {
        console.error("❌ Error generating match preview:", error);
        throw error;
    }
}
