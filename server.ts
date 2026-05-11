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

  const WHATSAPP_LINK = "https://wa.me/79000000000";

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
Если клиент готов записаться, сообщи, что запись ведется через WhatsApp и предоставь номер +7 (900) 000-00-00. Ссылка на WhatsApp: ${WHATSAPP_LINK}`;

  app.post("/api/chat", async (req, res) => {
    const { message, history } = req.body;

    const env = process.env;
    // Приоритет вашему новому ключу GOOGLE_API_KEY
    const rawKey = (env.GOOGLE_API_KEY || env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || env.NEXT_PUBLIC_GEMINI_API_KEY);
    const key = rawKey?.trim().replace(/^["']|["']$/g, '').replace(/\\n/g, '').replace(/\\r/g, '');

    if (!key) {
      const availableKeys = Object.keys(env).filter(k => k.includes("GEMINI") || k.includes("API")).join(", ");
      console.log("No API key found. Available keys:", availableKeys);
      return res.status(500).json({ 
        error: "Ключ API не настроен в AI Studio.",
        debug: `Доступные ключи: [${availableKeys || "нет"}]. Убедитесь, что вы добавили GEMINI_API_KEY в Settings -> Secrets (или Environment Variables).`
      });
    }

    try {
      const ai = new GoogleGenAI({ apiKey: key });
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          ...(history || []).map((item: any) => ({
            role: item.role === 'assistant' ? 'model' : item.role,
            parts: [{ text: String(item.parts?.[0]?.text || item.text || item.parts || "") }]
          })),
          { role: 'user', parts: [{ text: message }] }
        ],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION
        }
      });

      res.send(response.text);
    } catch (error: any) {
      console.error("AI Error:", error);
      const errorMsg = error.message || "";
      const isInvalidKey = errorMsg.includes("API key not valid") || errorMsg.includes("403") || errorMsg.includes("401");
      const isPlaceholder = key.includes("aBcD");
      
      res.status(500).json({ 
        error: isInvalidKey ? "Предоставленный API ключ недействителен." : `Ошибка ИИ: ${errorMsg}`,
        debug: isInvalidKey 
          ? `Ключ (длина: ${key.length}, начало: ${key.substring(0, 6)}..., конец: ...${key.substring(key.length - 4)}) отклонен Google. ${isPlaceholder ? "ПОХОЖЕ, ВЫ ИСПОЛЬЗУЕТЕ ПРИМЕР КЛЮЧА (AIzaSyB-aBcD...). Пожалуйста, создайте свой ключ на aistudio.google.com/app/apikey" : ""}` 
          : error.toString()
      });
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
