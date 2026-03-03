// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

// Initialize OpenAI client
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    debug: true // optional: enable SDK debug logging
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Route: Input page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "input.html"));
});

// Route: Gameplan page
app.get("/gameplan.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "gameplan.html"));
});

// API Route: Generate AI Gameplan
app.post("/generate-gameplan", async (req, res) => {
    const userData = req.body;

    if (!userData || Object.keys(userData).length === 0) {
        return res.status(400).json({ error: "No fighter data provided." });
    }

    const prompt = `
You are an experienced MMA coach.

Generate a detailed MMA gameplan for a fighter with these stats:
${JSON.stringify(userData, null, 2)}

Include:
- Round-by-round strategy
- Recommended drills
- Counters for opponent weaknesses
- Advice based on signature moves, defensive attributes, and fight IQ

Use actionable steps.
Use fight science jargon.
Use pop culture references from kung fu movies and real iconic boxing moments
`;

    try {
        const response = await client.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a professional MMA coach." },
                { role: "user", content: prompt }
            ],
            temperature: 0.7
        });

        return res.json({
            mode: "live",
            gameplan: response.choices[0].message.content
        });

    } catch (error) {
        // 🔥 ALWAYS FALL BACK TO DEMO MODE
        console.warn("OpenAI unavailable — serving DEMO MODE");
        console.warn(error.code || error.message);

        return res.json({
            mode: "demo",
            gameplan:
                `
            Tale of the Tape:  Advantage Breakdown
                Height: Slight edge. Better leverage in clinch exchanges
                Reach: +2” reach advantage. Critical for jab control
                Stance: Orthodox vs Orthodox. Outside foot battle less critical
                Experience: More championship rounds logged. Cardio proven under lights
                Broadcast Take:
                The reach and championship experience are the quiet advantages here. Over 15 minutes, that matters. If this turns into deep water, the edge leans toward composure.

            Round 1:  Establish the Narrative
            You’re going to see him take the center early.
                • Pump the jab, not just to score, but to blind and gather reads
                • Touch the lead leg with calf kicks to test stance stability
                • Keep guard tight on exits,  no naked retreats
                • Feint the level change early to plant wrestling doubt
            This round is about information gathering and tempo control.

            Keys to Victory
                Own the Center Line. Make the opponent circle, don’t follow. Cut angles.
                Layer the Threats. Strikes into level changes, level changes into clinch pressure.
                Win the Gas Tank Battle. Body work and fence control pay dividends late.

            Round 2: Pressure & Tactical Shifts
            Expect the pace to increase.
                • Jab-cross → level change entry
                • Drive opponent to the cage, establish head position
                • Mix short elbows in the clinch
                • Chain takedown attempts. Never single-shot
            This is where attrition begins.

            Between Rounds – Corner Advice (After Round 2)
            “Listen, you’re ahead if you stay disciplined. Don’t chase the finish. The jab is money. When he shells up, go body then head. If you get him to the fence, stay heavy on that underhook. Deep breath. You’re breaking him.”

            Round 3 – Championship Composure
            If ahead:
                • Control position
                • Force desperate shots
                • Counter clean
            If behind:
                • Increase output in bursts
                • Target body-head combinations
                • Hunt scrambles aggressively
            No wasted motion. Every exchange has intent.

            Live Scorecard Projection
                After Round 1: 10–9 (Control & cleaner jab)
                After Round 2: 20–18 (Fence dominance & takedown threats)
                Entering Round 3: Clear but competitive lead
            
            Broadcast Note:
            Unless something dramatic happens, this is trending toward a unanimous decision. But in MMA, one clean shot changes everything.

            
            Training Camp Emphasis
                • High-output jab rounds under fatigue
                • Cage-cutting positional drills
                • Strike-to-shot chain reps
                • Situational sparring from compromised positions


            *** Live AI broadcast-style analysis requires API billing.
            This is a demonstration output.
            `
        });
    }
});

//
//
//
//


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Debug API key loaded
console.log("OPENAI_API_KEY loaded:", !!process.env.OPENAI_API_KEY);
