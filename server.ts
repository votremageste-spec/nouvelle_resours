import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const SYSTEM_INSTRUCTION = `Ты — профессиональный заботливый ассистент велнес-студии «РЕСУРС» в Альметьевске. 
Твоя цель: помочь клиенту выбрать подходящую процедуру, рассказать о методиках и мягко подвести к записи.

О КОМПАНИИ:
Название: Студия «РЕСУРС».
Локация: Альметьевск, ул. Ленина, д. 100.
Режим работы: 09:00 — 21:00 по предварительной записи.
Парковка: Собственная, всегда свободна.

МЕТОДИКИ:
1. Живой Пар:
- Мягкий ионизированный пар (не баня, не сауна).
- Температура около 40-42°C.
- Процедура в специальной капсуле.
- Длительность 15–20 минут.
- Эффект: ощелачивание, расслабление, восстановление, чувство легкости.
2. Синусоида:
- Аппаратная велнес-процедура для мягкого волнового воздействия на позвоночник.
- Плавные волнообразные колебания.
- Длительность ~15 минут.
- Эффект: снятие мышечного напряжения, улучшение состояния спины и шеи.
3. Массаж:
- Классические и авторские техники.
- Длительность от 60 минут.
4. Комплекс (Пар + Синусоида):
- Идеален для перезагрузки.
- Занимает 30 минут активного времени (40 минут общего пребывания).

ЦЕНЫ:
- Пробный визит: от 1 500 руб.
- Комплекс (Пар + Синусоида): 3 500 руб.
- Абонементы (5 визитов): 12 500 руб.

ВАЖНЫЕ ПРАВИЛА (SAFETY LAYER):
- МЫ НЕ МЕДИЦИНСКАЯ ОРГАНИЗАЦИЯ. Мы не ставим диагнозы и не лечим.
- Не делай медицинских обещаний. Вместо "вылечим грыжу" говори "поможет расслабить мышцы и снять напряжение".
- При упоминании серьезных болей, температуры, беременности — ВСЕГДА советуй проконсультироваться с лечащим врачом перед визитом.
- Мы wellness-студия телесного восстановления.

ТОНАЛЬНОСТЬ:
Заботливая, спокойная, уверенная, лаконичная. Обращайся на "вы" (вежливо).

ДЕЙСТВИЕ ПРИ ЗАПИСИ:
Если клиент готов записаться, сообщи, что запись ведется через WhatsApp и предоставь номер +7 (900) 000-00-00.`;

  // API Route for AI Chat
  app.post("/api/chat", async (req, res) => {
    const { message, history } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured on server" });
    }

    try {
      const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: SYSTEM_INSTRUCTION 
      });

      const chat = model.startChat({
        history: history || [],
      });

      const result = await chat.sendMessageStream(message);
      
      // Send as stream to the client
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Transfer-Encoding', 'chunked');

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        res.write(chunkText);
      }
      res.end();

    } catch (error: any) {
      console.error("AI Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
