import { GoogleGenAI, type GenerateContentResponse } from "@google/genai";
import type { VercelRequest, VercelResponse } from "@vercel/node";

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, history } = req.body;

  const env = process.env;
  // Приоритет вашему новому ключу GOOGLE_API_KEY
  const rawKey = (env.GOOGLE_API_KEY || env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || env.NEXT_PUBLIC_GEMINI_API_KEY);
  const key = rawKey?.trim().replace(/^["']|["']$/g, '').replace(/\\n/g, '').replace(/\\r/g, '');

  if (!key) {
    const availableKeys = Object.keys(env).filter(k => k.includes("GEMINI") || k.includes("API")).join(", ");
    return res.status(500).json({ 
      error: "Ключ API не найден в переменных окружения Vercel.",
      debug: `Доступные ключи: [${availableKeys || "нет"}]. Убедитесь, что после добавления ключа вы нажали 'Redeploy' в панели Vercel.`
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

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION
      }
    });

    return res.status(200).send(response.text);
  } catch (error: any) {
    console.error("Vercel AI Error Detailed:", error);
    let errorMsg = error.message || String(error);
    
    // Обработка специфических ошибок Google API
    if (errorMsg.includes("503") || errorMsg.includes("UNAVAILABLE")) {
      errorMsg = "Сервер Google временно перегружен. Это часто случается на бесплатном тарифе. Пожалуйста, попробуйте еще раз через полминуты.";
    } else if (errorMsg.includes("429") || errorMsg.includes("QUOTA_EXCEEDED")) {
      errorMsg = "Превышен лимит запросов (Quota Exceeded). Пожалуйста, подождите немного или используйте платный ключ.";
    } else if (errorMsg.includes("403") || errorMsg.includes("401") || errorMsg.includes("API_KEY_INVALID")) {
      errorMsg = "Проблема с ключом API. Убедитесь, что в переменных Vercel ключ GOOGLE_API_KEY указан верно и проект опубликован (Redeployed).";
    } else if (errorMsg.includes("404") || errorMsg.includes("NOT_FOUND")) {
      errorMsg = "Модель не найдена. Похоже, ваш ключ не имеет доступа к выбранной модели (gemini-flash-latest).";
    }
    
    return res.status(500).json({ 
      error: `Ошибка ИИ: ${errorMsg}`,
      debug: `Код ошибки: ${error.status || 'неизвестен'}. Ключ: ${key.substring(0, 6)}...`
    });
  }
}
