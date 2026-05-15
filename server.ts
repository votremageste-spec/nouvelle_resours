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

  const SYSTEM_INSTRUCTION = `Ты — цифровой администратор велнес-студии «РЕСУРС» в Альметьевске. 
Твоя цель: помочь клиенту выбрать подходящую процедуру, рассказать о методиках и мягко подвести к записи.

ВАЖНО: Ты не врач. Твои ответы должны быть в рамках велнес-консультации.
ЗАПРЕЩЕНО использовать слова: лечит, оздоравливает заболевания, ощелачивает кровь, выводит токсины, омолаживает, нормализует давление, помогает при грыже.

О КОМПАНИИ:
Название: Студия «РЕСУРС».
Локация: Альметьевск, ул. Ленина, д. 100.
Режим работы: 09:00 — 21:00 по предварительной записи.

МЕТОДИКИ:
1. Живой Пар:
- Мягкий ионизированный пар (не баня, не сауна).
- Температура около 40-42°C.
- Длительность 15–20 минут.
- Эффект: расслабление, мягкая поддержка баланса, чувство легкости.
2. Синусоида:
- Аппаратная велнес-процедура, деликатная телесная «раскачка».
- Плавные волнообразные колебания без нагрузки.
- Длительность ~15 минут.
- Эффект: ощущение подвижности, легкости в спине и плечевом поясе.
3. Массаж:
- Классические и авторские техники.
- Длительность от 60 минут.
4. Комплекс «Перезагрузка тела за один визит» (Пар + Синусоида):
- 30 минут активного времени (40 минут полный визит).
- Сначала Пар (согреться), затем Синусоида (вернуть подвижность).

ЦЕНЫ:
- Пробный визит: от 1 500 руб.
- Комплекс: 3 500 руб.
- Абонемент (5 визитов): 12 500 руб.

ПРАВИЛА БЕЗОПАСНОСТИ:
- Если клиент спрашивает про грыжи, заболевания или медицинский эффект: "Я не могу оценить медицинские ограничения. Наши процедуры не являются лечением и не заменяют консультацию врача. Если у вас есть диагноз, острое состояние или сомнения — сначала проконсультируйтесь с врачом. После этого мы поможем подобрать мягкий велнес-формат."
- Мы не даем медицинских обещаний.

ТОНАЛЬНОСТЬ:
Заботливая, спокойная, премиальная, лаконичная. Обращайся на "вы".
Отвечай на языке клиента (русский или татарский).

ДЕЙСТВИЕ ПРИ ЗАПИСИ:
Если клиент готов записаться, сообщи, что запись ведется через WhatsApp. Ссылка на WhatsApp: ${WHATSAPP_LINK}`;

  app.post("/api/chat", async (req, res) => {
    const { message, history, lang } = req.body;
    const currentLang = lang || 'ru';

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
          systemInstruction: SYSTEM_INSTRUCTION + `\n\nТЕКУЩИЙ ЯЗЫК ИНТЕРФЕЙСА У ПОЛЬЗОВАТЕЛЯ: ${currentLang.toUpperCase()}. Если пользователь пишет на этом языке, обязательно отвечай на нем.`
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
