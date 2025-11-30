import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash"; // istəsən .env-də dəyişə bilərsən

app.get("/", (req, res) => {
  res.send("MaliAI backend is up (Gemini)");
});

app.post("/api/chat", async (req, res) => {
  try {
    if (!GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is missing");
      return res.status(500).json({ error: "GEMINI_API_KEY is not set in .env" });
    }

    const { messages = [], temperature, max_tokens } = req.body;

    // 1) system mesajını ayır
    const systemMessage = messages.find((m) => m.role === "system");

    // 2) qalan bütün mesajlar (user + assistant)
    const chatMessages = messages.filter((m) => m.role !== "system");

    // 3) Gemini formatına çevir: assistant -> model, qalan hamısı -> user
    const contents = chatMessages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const body = {
      contents,
      generationConfig: {},
    };

    // system mesajını Gemini-yə systemInstruction kimi göndəririk
    if (systemMessage) {
      body.systemInstruction = {
        role: "user",
        parts: [{ text: systemMessage.content }],
      };
    }

    if (typeof temperature === "number") {
      body.generationConfig.temperature = temperature;
    }
    if (typeof max_tokens === "number") {
      body.generationConfig.maxOutputTokens = max_tokens;
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      // 400-ləri görmək üçün loglayaq
      console.error("Gemini API error:", response.status, data);
      return res.status(response.status).json(data);
    }

    const candidate = data.candidates?.[0];
    const text =
      candidate?.content?.parts
        ?.map((p) => p.text || "")
        .join("") || "";

    const openAIStyleResponse = {
      id: data.responseId || `gemini-chat-${Date.now()}`,
      object: "chat.completion",
      created: Math.floor(Date.now() / 1000),
      model: GEMINI_MODEL,
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content: text,
          },
          finish_reason:
            typeof candidate?.finishReason === "string"
              ? candidate.finishReason.toLowerCase()
              : "stop",
        },
      ],
    };

    res.json(openAIStyleResponse);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} (Gemini)`);
});
