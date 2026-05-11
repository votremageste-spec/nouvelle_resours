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
      
      // Форматируем историю более надежно
      const contents = (history || []).map((item: any) => {
        let text = "";
        if (typeof item.text === 'string') text = item.text;
        else if (Array.isArray(item.parts)) text = item.parts[0]?.text || "";
        else if (typeof item.parts === 'string') text = item.parts;
        else if (item.content) text = item.content;
        
        return {
          role: item.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: String(text || "") }]
        };
      });

      // Добавляем текущее сообщение
      contents.push({ role: 'user', parts: [{ text: message }] });

      const response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION
        }
      });

      res.send(response.text);
    } catch (error: any) {
      console.error("AI Error Detailed:", error);
      let errorMsg = error.message || String(error);
      
      // Обработка специфических ошибок Google API
      if (errorMsg.includes("503") || errorMsg.includes("UNAVAILABLE")) {
        errorMsg = "Сервер Google временно перегружен. Пожалуйста, попробуйте еще раз через полминуты.";
      } else if (errorMsg.includes("429") || errorMsg.includes("QUOTA_EXCEEDED")) {
        errorMsg = "Исчерпан лимит запросов. Попробуйте еще раз через минуту.";
      } else if (errorMsg.includes("403") || errorMsg.includes("401") || errorMsg.includes("API_KEY_INVALID")) {
        errorMsg = "Ошибка авторизации: ваш API ключ не принят Google. Проверьте его в настройках.";
      } else if (errorMsg.includes("404") || errorMsg.includes("NOT_FOUND")) {
        errorMsg = "Модель не найдена (gemini-flash-latest). Возможно, ваш ключ не поддерживает эту модель.";
      }
      
      res.status(500).json({ 
        error: `Ошибка ИИ: ${errorMsg}`,
        debug: `Ключ (первые 6 симв.): ${key.substring(0, 6)}...`
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
