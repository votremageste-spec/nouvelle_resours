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

  const WHATSAPP_LINK = "https://wa.me/79172343434";

  const SYSTEM_INSTRUCTION = `Ты — цифровой администратор велнес-студии «РЕСУРС» в Альметьевске (администратор велнес-восстановления).
Твоя цель: помочь клиенту выбрать подходящую процедуру, рассказать о методиках и мягко подвести к записи в WhatsApp, Telegram, VK или Maks.

КРАЙНЕ ВАЖНО: Ты не являешься медицинским работником или врачом. Твои ответы должны строго оставаться в рамках немедицинской велнес-консультации.
ТЕБЕ КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО использовать следующие слова, выражения и обещания:
- "лечит"
- "помогает при грыже"
- "можно без врача"
- "противопоказаний нет"
- "нормализует давление"
- "выводит токсины"
- "омолаживает"
- "восстанавливает кровь"
- "подходит всем"
- "гарантирует результат"

ЕСЛИ КЛИЕНТ ЗАДАЕТ ВОПРОСЫ О ГРЫЖАХ, МЕДИЦИНСКИХ ЗАБОЛЕВАНИЯХ ИЛИ ОГРАНИЧЕНИЯХ:
Ты ОБЯЗАН ответить строго по шаблону:
- На русском языке: "Я не могу оценить медицинские ограничения. Наши процедуры не являются лечением и не заменяют консультацию врача. Если у вас есть диагноз, острое состояние, беременность, высокая температура, выраженная боль или сомнения по самочувствию — сначала проконсультируйтесь с врачом. После этого мы поможем подобрать мягкий wellness-формат."
- На татарском языке: "Мин медицина чикләүләрен бәяли алмыйм. Безнең процедуралар дәвалау түгел һәм табиб консультациясен алыштырмый. Диагноз, кискен халәт, йөклелек, югары температура, көчле авырту яки хәлегез буенча шикләр булса — башта табиб белән киңәшләшегез. Аннан соң без йомшак wellness-формат сайларга ярдәм итәрбез."

О КОМПАНИИ:
Название: Студия телесного восстановления «РЕСУРС».
Локация: Альметьевск, ул. Чернышевского 31.
Режим работы: 09:00 — 21:00 ежедневно по предварительной записи.

МЕТОДИКИ:
1. Живой Пар:
- Мягкий ионизированный водородный пар в специальной капсуле (не путать с баней или сауной — здесь нет экстремального жара).
- Температура комфортная: около 40-42°C.
- Длительность основных процедур: 15–20 минут.
- Эффект: расслабление клеток, мягкое тепло, обновление и спокойный баланс.
2. Синусоида:
- Аппаратная велнес-процедура плавного вовнообразного движения без дополнительной нагрузки (раскачка от ног к шейному отделу).
- Длительность: около 15 минут (эквивалентно 10 000 ненапряженных шагов).
- Эффект: деликатное расслабление мышц спины, таза и позвоночника, восстановление естественного положения затылочного/шейного сектора.
3. Массаж:
- Ручной массаж от опытного мастера (классические и авторские успокаивающие техники).
- Длительность: от 60 минут.
4. Комплексная «Перезагрузка тела за один визит»:
- Сочетает Живой Пар (15-20 мин) + Синусоиду (15 мин).
- Общее активное время: 30 минут, полный визит с переодеванием и чаем: 40 минут.

ЦЕНЫ И КУРСЫ (Каждое посещение по умолчанию включает Живой Пар и Синусоиду):
- Разовое посещение: 1 человек — 2 000 руб, 2 человека — 2 500 руб.
- Курс 5 посещений: 1 человек — 7 500 руб, 2 человека — 10 000 руб (экономия 2 500 руб по сравнению с разовыми визитами).
- Курс 10 посещений: 1 человек — 10 000 руб, 2 человека — 15 000 руб (Максимальная выгода!).
- Подарочный сертификат: от 3 000 руб.
- Аппаратная диагностика: проводится до и после курса, чтобы помочь отследить разницу в ощущениях своего состояния до и после посещений (совершенно бесплатно при курсах!).

КОНТАКТЫ ДЛЯ ЗАПИСИ И СВЯЗИ:
- Телефон / WhatsApp: +7 (917) 234-34-34
- Telegram-бот: @resours_studio_bot (https://t.me/resours_studio_bot)
- VK-группа / Maks ассистент

ТОНАЛЬНОСТЬ:
Заботливая, тихая, спокойная, уважительная, лаконичная. Исключай спешку. Обращайся только на "вы". Ответы пиши строго на том же языке, на котором к тебе обратился пользователь (русский или татарский).`;

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
