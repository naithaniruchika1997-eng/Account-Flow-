import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parsing middleware
  app.use(express.json());

  // API Route - Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // API Route - Parse meeting minutes using Gemini
  app.post("/api/gemini/parse-minutes", async (req, res) => {
    try {
      const { rawNotes, accountName, title, referenceDate } = req.body;

      if (!rawNotes || typeof rawNotes !== "string" || !rawNotes.trim()) {
        return res.status(400).json({ error: "Missing or invalid 'rawNotes' input." });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
        return res.status(400).json({
          error: "Gemini API Key is missing. Please add the GEMINI_API_KEY secret in Google AI Studio Settings > Secrets panel."
        });
      }

      // Initialize the Gemini SDK inside the request to handle key injection dynamically
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const todayStr = referenceDate || new Date().toISOString().split("T")[0];

      const systemInstruction = `You are an expert Account Manager and project management specialist. Your task is to process notes/transcript from an account meeting (client: "${accountName || "General"}", topic: "${title || "Account Alignment"}").
You will pull out an elegant, structured summary and a list of specific action items.
- Create a summary that covers the key discussion points, main client concerns, positive outcomes, and next sync milestones.
- Identify actionable items. Each action item must have a specific title, a realistic assignee mentioned or general role/team, and an estimated dueDate format (YYYY-MM-DD). If no clear due date was mentioned, calculate it based on 7 days from the reference date (${todayStr}). if no specific assignee is clear, assign it to "Unassigned" or "Account Owner".`;

      const prompt = `Here are the raw notes from the meeting:
---
${rawNotes}
---
Please extract:
1. A concise, professional Markdown summary of the meeting.
2. A clean array of individual action items.
Reference date is: ${todayStr}.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: {
                type: Type.STRING,
                description: "Concise professional Markdown summary of the meeting discussion points, objectives met, and key approvals/concerns.",
              },
              actionItems: {
                type: Type.ARRAY,
                description: "Array of structured tasks or action items derived from the notes.",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: {
                      type: Type.STRING,
                      description: "Action title (e.g. 'Update onboarding slides with Q3 product features').",
                    },
                    assignee: {
                      type: Type.STRING,
                      description: "The name of the assignee specified in the notes. Default to 'Unassigned' or 'Account Owner' if unspecified.",
                    },
                    dueDate: {
                      type: Type.STRING,
                      description: "Due date in YYYY-MM-DD format.",
                    }
                  },
                  required: ["title", "assignee", "dueDate"],
                }
              }
            },
            required: ["summary", "actionItems"]
          }
        }
      });

      const text = response.text;
      if (!text) {
        return res.status(500).json({ error: "No response text received from Gemini model." });
      }

      const parsed = JSON.parse(text);
      res.json(parsed);

    } catch (error: any) {
      console.error("Error processing meeting minutes:", error);
      res.status(500).json({
        error: error.message || "An error occurred while parsing meeting minutes.",
      });
    }
  });

  // Vite integration for development or file static serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();
