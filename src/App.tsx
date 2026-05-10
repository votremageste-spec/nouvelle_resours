import { motion, AnimatePresence } from "motion/react";
import { 
  Waves, 
  Wind, 
  Hand, 
  MapPin, 
  MessageCircle, 
  ChevronRight, 
  Clock, 
  Heart,
  Menu,
  X,
  Play,
  ShieldCheck,
  HelpCircle,
  Phone,
  Send,
  User,
  Bot,
  Loader2
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { GoogleGenAI } from "@google/genai";

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
Если клиент готов записаться, сообщи, что запись ведется через WhatsApp и предоставь номер +7 (900) 000-00-00 или ссылку ${WHATSAPP_LINK}.`;

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// --- Components ---

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '', 
  href,
  target
}: any) => {
  const baseStyles = "px-8 py-4 rounded-full font-sans text-[11px] uppercase tracking-[0.2em] font-bold transition-all duration-300 flex items-center justify-center gap-2 group";
  const variants: any = {
    primary: "bg-studio-ink text-white hover:bg-studio-accent",
    secondary: "border border-studio-ink/20 text-studio-ink hover:bg-studio-ink hover:text-white",
    outline: "border border-studio-accent text-studio-accent hover:bg-studio-accent hover:text-white",
    ghost: "text-studio-ink hover:text-studio-accent p-0"
  };

  const Component = href ? 'a' : 'button';

  return (
    <Component 
      href={href} 
      onClick={onClick} 
      target={target}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </Component>
  );
};

const SectionHeading = ({ title, subtitle, badge }: any) => (
  <div className="mb-16 md:mb-24 text-center">
    {badge && (
      <span className="inline-block text-[10px] uppercase tracking-[0.4em] text-studio-accent font-bold mb-6">
        {badge}
      </span>
    )}
    <h2 className="text-4xl md:text-7xl font-light mb-6 md:mb-8 leading-tight">{title}</h2>
    {subtitle && <p className="max-w-2xl mx-auto text-studio-muted text-lg font-light leading-relaxed">{subtitle}</p>}
  </div>
);

// --- Sections ---

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);

  // AI Chat State
  const [messages, setMessages] = useState<any[]>([
    { id: '1', role: 'assistant', text: 'Добрый день! Я цифровой ассистент студии «РЕСУРС». Помогу вам выбрать процедуру, отвечу на вопросы о длительности и помогу записаться. \n\nЧто вас интересует?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage = { id: Date.now().toString(), role: 'user', text };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const history = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      }));

      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
        history: history
      });

      let assistantMessageId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: assistantMessageId, role: 'assistant', text: '' }]);

      const result = await chat.sendMessageStream({ message: text });
      let fullText = "";

      for await (const chunk of result) {
        const chunkText = chunk.text;
        fullText += chunkText;
        setMessages(prev => prev.map(msg => 
          msg.id === assistantMessageId ? { ...msg, text: fullText } : msg
        ));
      }
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'assistant', 
        text: 'Извините, произошла ошибка. Пожалуйста, попробуйте позже или напишите нам в WhatsApp.' 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen selection:bg-studio-accent/30">
      
      {/* 5. Шапка и навигация */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled ? "bg-studio-bg/90 backdrop-blur-xl py-3 border-b border-studio-line" : "bg-transparent py-6"
      }`}>
        <div className="studio-container flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-studio-accent flex items-center justify-center text-white shadow-lg">
              <span className="font-serif font-bold text-xl uppercase tracking-tighter">Р</span>
            </div>
            <span className="font-serif text-2xl tracking-[0.2em] font-medium uppercase text-studio-ink">Ресурс</span>
          </div>

          <div className="hidden lg:flex items-center gap-10 text-[10px] uppercase tracking-[0.25em] font-bold text-studio-muted">
            <a href="#services" className="hover:text-studio-accent transition-colors">Услуги</a>
            <a href="#audience" className="hover:text-studio-accent transition-colors">Кому подходит</a>
            <a href="#process" className="hover:text-studio-accent transition-colors">Как проходит</a>
            <a href="#pricing" className="hover:text-studio-accent transition-colors">Цены</a>
            <a href="#faq" className="hover:text-studio-accent transition-colors">Вопросы</a>
            <a href="#contacts" className="hover:text-studio-accent transition-colors">Контакты</a>
            <Button href={WHATSAPP_LINK} target="_blank" className="!px-6 !py-2.5">Записаться</Button>
          </div>

          <button className="lg:hidden text-studio-ink" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-studio-bg border-b border-studio-line overflow-hidden"
            >
              <div className="flex flex-col p-8 gap-6 text-[12px] uppercase tracking-[0.3em] font-bold text-center">
                <a href="#services" onClick={() => setMobileMenuOpen(false)}>Услуги</a>
                <a href="#audience" onClick={() => setMobileMenuOpen(false)}>Кому подходит</a>
                <a href="#process" onClick={() => setMobileMenuOpen(false)}>Как проходит</a>
                <a href="#pricing" onClick={() => setMobileMenuOpen(false)}>Цены</a>
                <a href="#faq" onClick={() => setMobileMenuOpen(false)}>Вопросы</a>
                <a href="#contacts" onClick={() => setMobileMenuOpen(false)}>Контакты</a>
                <Button href={WHATSAPP_LINK} target="_blank">Записаться в WhatsApp</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 6. Первый экран */}
      <header className="relative min-h-screen flex items-center py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2670&auto=format&fit=crop" 
            alt="Wellness atmosphere" 
            className="w-full h-full object-cover grayscale-[20%]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-studio-bg via-studio-bg/70 to-transparent lg:from-studio-bg lg:via-studio-bg/60"></div>
          <div className="absolute inset-0 bg-studio-bg/10"></div>
        </div>

        <div className="studio-container relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <span className="inline-block px-4 py-1.5 border border-studio-accent/40 text-studio-accent rounded-full text-[10px] uppercase tracking-[0.4em] font-bold mb-8 bg-studio-bg/30 backdrop-blur-sm">
              Альметьевск • wellness-студия телесного восстановления
            </span>
            <h1 className="text-5xl md:text-8xl lg:text-9xl font-light leading-[1.05] tracking-tighter mb-10">
              ВЕРНИ СЕБЕ <br />
              <span className="italic-serif text-studio-accent">РЕСУРС</span>
            </h1>
            <p className="max-w-xl text-lg md:text-xl text-studio-ink font-light leading-relaxed mb-10">
              Мягкое восстановление через Живой Пар, Синусоиду и массаж. Для тех, кто устал, чувствует напряжение в теле и хочет вернуться к ощущению лёгкости.
            </p>
            
            <div className="p-5 border-l-2 border-studio-accent/20 mb-12 bg-white/10 backdrop-blur-sm rounded-r-2xl max-w-xl">
               <p className="text-sm italic text-studio-muted">
                Без медицинских обещаний. Только тепло, движение, забота и спокойное внимание к телу.
               </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
              <Button href={WHATSAPP_LINK} target="_blank" className="!px-10 !py-5 shadow-2xl">
                Записаться на первый визит
              </Button>
              <Button onClick={() => setIsAiOpen(true)} variant="secondary" className="!px-10 !py-5">
                Помочь выбрать процедуру
              </Button>
            </div>
            
            {/* 6.3 Быстрые факты */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 lg:mt-24">
              {[
                { icon: Waves, text: "Живой Пар — 15–20 минут" },
                { icon: Clock, text: "Комплекс — около 30 минут" },
                { icon: MapPin, text: "Удобная парковка" },
                { icon: Heart, text: "Всё необходимое подготовим" }
              ].map((fact, i) => (
                <div key={i} className="flex flex-col gap-3 p-5 bg-white/40 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/60 transition-colors">
                  <fact.icon size={18} className="text-studio-accent" />
                  <span className="text-[10px] uppercase tracking-widest font-bold leading-tight">{fact.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </header>

      {/* 13. Главный продающий блок: Комплекс */}
      <section className="py-24 bg-studio-ink text-white">
        <div className="studio-container">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <span className="text-studio-accent text-[11px] uppercase tracking-[0.4em] font-bold mb-6 block">Главный продукт</span>
              <h2 className="text-5xl md:text-7xl font-light mb-8">Перезагрузка тела за один визит</h2>
              <p className="text-xl text-white/70 font-light leading-relaxed mb-12">
                Сначала мягкий <span className="text-white font-medium underline underline-offset-8">Живой Пар</span> помогает телу расслабиться и согреться. Затем <span className="text-white font-medium underline underline-offset-8">Синусоида</span> добавляет плавное движение, чтобы вернуть ощущение лёгкости.
              </p>
              
              <div className="grid grid-cols-2 gap-10 mb-12">
                <div className="space-y-2">
                  <div className="text-[10px] uppercase tracking-widest opacity-50">Активное время</div>
                  <div className="text-3xl font-serif italic text-studio-accent">30 минут</div>
                </div>
                <div className="space-y-2">
                  <div className="text-[10px] uppercase tracking-widest opacity-50">Полный визит</div>
                  <div className="text-3xl font-serif italic text-studio-accent">40 минут</div>
                </div>
              </div>

              <div className="space-y-4">
                <Button href={WHATSAPP_LINK} className="w-full sm:w-auto !bg-studio-accent hover:!bg-white hover:text-studio-ink">Попробовать комплекс</Button>
                <p className="text-[10px] opacity-40 uppercase tracking-widest">Не является медицинской процедурой</p>
              </div>
            </div>
            <div className="relative">
               <div className="aspect-square rounded-[60px] overflow-hidden">
                 <img 
                  src="https://images.unsplash.com/photo-1591343395902-1adcb454c7e7?q=80&w=2574&auto=format&fit=crop" 
                  alt="Atmosphere" 
                  className="w-full h-full object-cover"
                 />
               </div>
               <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-white/10 backdrop-blur-2xl rounded-full border border-white/10 flex items-center justify-center p-6 text-center animate-pulse-slow">
                 <span className="font-serif italic text-xl">Верни себе состояние</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Блок «Для кого РЕСУРС» */}
      <section id="audience" className="py-32 bg-white">
        <div className="studio-container">
          <SectionHeading 
            badge="Кому подходит"
            title="Для тех, чьему телу нужно восстановление"
            subtitle="Выберите, что ближе к вашему состоянию — мы подскажем мягкий формат первого визита."
          />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Офисные сотрудники", p: "Напряжение в шее, спине, хроническая усталость.", offer: "Синусоида + массаж спины", note: "60 минут — и тело снова ваше" },
              { title: "Пенсионеры 60+", p: "Скованность, усталость после активности.", offer: "Живой Пар, курс из 10 визитов", note: "Мягко. Спокойно. С ощутимой заботой" },
              { title: "Спортсмены", p: "Забитые мышцы, восстановление после нагрузки.", offer: "Синусоида + Живой Пар", note: "Восстановление как часть тренировки" },
              { title: "Мамы", p: "Нет времени на себя, тревожность, стресс.", offer: "Пар + массаж, сертификаты", note: "Ваш личный час восстановления" },
              { title: "Корпоративные клиенты", p: "Усталость сотрудников, HR-задачи.", offer: "Абонементы и групповые визиты", note: "Забота о команде — инвестиция" },
              { title: "Профилактика", p: "Желание предотвратить накопление усталости.", offer: "Курсы 10–15 сеансов", note: "Лучшее вложение в себя" }
            ].map((card, i) => (
              <div key={i} className="group p-10 bg-studio-card border border-studio-line rounded-[40px] hover:border-studio-accent transition-all duration-500 flex flex-col justify-between">
                <div>
                  <h4 className="text-2xl font-medium mb-4">{card.title}</h4>
                  <p className="text-studio-muted text-sm leading-relaxed mb-8">{card.p}</p>
                </div>
                <div className="pt-8 border-t border-studio-line">
                  <div className="text-[10px] uppercase tracking-widest text-studio-accent font-bold mb-2">Рекомендуем:</div>
                  <div className="text-sm font-medium mb-3">{card.offer}</div>
                  <div className="text-xs italic text-studio-muted">{card.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8-12. Услуги */}
      <section id="services" className="py-32">
        <div className="studio-container">
          <SectionHeading badge="Методики" title="Три пути к восстановлению" />
          
          <div className="grid gap-32">
            {/* Живой Пар */}
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="rounded-[60px] overflow-hidden aspect-[4/3] bg-studio-ink/10">
                <img 
                  src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=2670&auto=format&fit=crop" 
                  alt="Living Steam" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <Waves className="text-studio-accent mb-8" size={40} />
                <h3 className="text-4xl md:text-6xl font-light mb-8">Живой Пар</h3>
                <p className="text-xl font-light text-studio-muted leading-relaxed mb-8">
                  Мягкий ионизированный пар при комфортной температуре около 40-42°C в специальной капсуле. 15–20 минут тепла, влажности и спокойного дыхания. Это не баня и не сауна: здесь нет экстремального жара и спешки. В процессе процедуры происходит ощелачивание, способствующее восстановлению, само оздоровлению, и ощущению молодости.
                </p>
                <div className="flex gap-10 mb-10">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-studio-muted mb-2">Время</div>
                    <div className="text-2xl font-serif">15-20 мин</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-studio-muted mb-2">Температура</div>
                    <div className="text-2xl font-serif">Комфортная</div>
                  </div>
                </div>
                <Button variant="secondary" href={WHATSAPP_LINK} target="_blank">Записаться на Живой Пар</Button>
              </div>
            </div>

            {/* Синусоида */}
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="order-2 md:order-1">
                <Wind className="text-studio-accent mb-8" size={40} />
                <h3 className="text-4xl md:text-6xl font-light mb-8">Синусоида</h3>
                <p className="text-xl font-light text-studio-muted leading-relaxed mb-8">
                  Синусоида — это аппаратная wellness-процедура, во время которой вы лежите и расслабляетесь, а тренажёр мягко передаёт телу волнообразное движение. Плавное восстановление без физической нагрузки.
                </p>
                <div className="flex gap-10 mb-10">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-studio-muted mb-2">Время</div>
                    <div className="text-2xl font-serif">~15 мин</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-studio-muted mb-2">Эффект</div>
                    <div className="text-2xl font-serif">Легкость</div>
                  </div>
                </div>
                <Button variant="secondary" href={WHATSAPP_LINK} target="_blank">Записаться на Синусоиду</Button>
              </div>
              <div className="order-1 md:order-2 rounded-[60px] overflow-hidden aspect-[4/3] bg-studio-ink/10">
                <img 
                  src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2670&auto=format&fit=crop" 
                  alt="Sinusoid" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Массаж */}
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="rounded-[60px] overflow-hidden aspect-[4/3] bg-studio-ink/10">
                <img 
                  src="https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=2670&auto=format&fit=crop" 
                  alt="Massage" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <Hand className="text-studio-accent mb-8" size={40} />
                <h3 className="text-4xl md:text-6xl font-light mb-8">Массаж</h3>
                <p className="text-xl font-light text-studio-muted leading-relaxed mb-8">
                  Классические и авторские техники для расслабления, снятия напряжения и ощущения телесной лёгкости. Мастер подбирает интенсивность под ваше состояние.
                </p>
                <div className="flex gap-10 mb-10">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-studio-muted mb-2">Время</div>
                    <div className="text-2xl font-serif">от 60 мин</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-studio-muted mb-2">Техника</div>
                    <div className="text-2xl font-serif">Индивидуально</div>
                  </div>
                </div>
                <Button variant="secondary" href={WHATSAPP_LINK} target="_blank">Выбрать массаж</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 14. Как проходит первый визит */}
      <section id="process" className="py-32 bg-studio-card border-y border-studio-line">
        <div className="studio-container">
          <SectionHeading badge="Процесс" title="Всё спокойно: мы проведём вас через каждый шаг" />
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { s: 1, t: "Запись", d: "Вы пишете в WhatsApp или задаете вопрос нашему ассистенту на сайте." },
              { s: 2, t: "Уточнение", d: "Мы спрашиваем, что вас беспокоит и есть ли какие-то ограничения по здоровью." },
              { s: 3, t: "Подбор", d: "Предлагаем Живой Пар, Синусоиду, массаж или их комплексное сочетание." },
              { s: 4, t: "Подготовка", d: "На месте выдаем всё необходимое, объясняем правила и помогаем настроиться." },
              { s: 5, t: "Процедура", d: "Вы отдыхаете, дышите и расслабляетесь в заботливой атмосфере студии." },
              { s: 6, t: "После визита", d: "Можно выпить чай, задать вопросы мастеру и выбрать удобный курс." }
            ].map((step, i) => (
              <div key={i} className="flex gap-6">
                <div className="w-12 h-12 rounded-full border border-studio-accent/30 flex items-center justify-center shrink-0 font-serif italic text-studio-accent text-xl">
                  {step.s}
                </div>
                <div>
                  <h4 className="text-xl font-medium mb-2 uppercase tracking-wide">{step.t}</h4>
                  <p className="text-studio-muted text-sm leading-relaxed">{step.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 15-16. Форматы и цены */}
      <section id="pricing" className="py-32 bg-white">
        <div className="studio-container">
          <SectionHeading badge="Цены" title="Форматы посещения" />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { type: "Пробный визит", price: "от 1 500 ₽", d: "Для первого знакомства: Пар или Синусоида", popular: false },
              { type: "Живой Пар + Синусоида", price: "3 500 ₽", d: "Комплексная перезагрузка (~30 мин)", popular: true },
              { type: "Абонемент 5 визитов", price: "12 500 ₽", d: "Выгоднее разовых посещений", popular: false },
              { type: "Сертификат", price: "от 3 000 ₽", d: "Дарите своим близким РЕСУРС", popular: false }
            ].map((item, i) => (
              <div key={i} className={`p-8 rounded-[40px] border flex flex-col justify-between ${
                item.popular ? "bg-studio-ink text-white border-studio-ink scale-105 shadow-2xl" : "bg-studio-card border-studio-line"
              }`}>
                <div>
                  <div className="text-[10px] uppercase tracking-widest opacity-50 mb-4">{item.type}</div>
                  <div className="text-3xl font-serif mb-4">{item.price}</div>
                  <p className={`text-sm mb-8 ${item.popular ? "text-white/60" : "text-studio-muted"}`}>{item.d}</p>
                </div>
                <Button 
                  href={WHATSAPP_LINK}
                  target="_blank"
                  variant={item.popular ? "outline" : "secondary"}
                  className={`w-full !px-4 ${item.popular ? "!border-white !text-white hover:!bg-white hover:!text-studio-ink" : ""}`}
                >
                  Записаться
                </Button>
              </div>
            ))}
          </div>
          
          {/* 17. Корпоративный блок */}
          <div className="mt-20 p-12 bg-studio-accent rounded-[50px] text-white overflow-hidden relative">
            <div className="relative z-10 max-w-2xl">
              <h3 className="text-3xl md:text-5xl font-light mb-6">Корпоративная забота о сотрудниках</h3>
              <p className="text-lg opacity-80 mb-10">Программы для компаний Альметьевска: сертификаты и абонементы как мягкий формат заботы о команде.</p>
              <Button href={WHATSAPP_LINK} target="_blank" className="!bg-white !text-studio-accent">Обсудить формат</Button>
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-10 translate-x-1/4">
               <Heart size={400} />
            </div>
          </div>
        </div>
      </section>

      {/* 18. Противопоказания */}
      <section className="py-24 bg-studio-bg">
        <div className="studio-container">
          <div className="max-w-4xl mx-auto p-12 bg-white rounded-[60px] border border-studio-line flex flex-col md:flex-row gap-12 items-center">
             <div className="w-20 h-20 rounded-full bg-studio-accent/10 flex items-center justify-center shrink-0">
               <ShieldCheck size={40} className="text-studio-accent" />
             </div>
             <div>
               <h4 className="text-3xl font-serif mb-4">Когда стоит быть осторожнее</h4>
               <p className="text-studio-muted leading-relaxed italic">
                 Наши процедуры не являются медицинскими услугами. Если у вас есть хронические заболевания, острое состояние, высокая температура, беременность или сомнения — перед визитом лучше проконсультироваться с врачом.
               </p>
             </div>
          </div>
        </div>
      </section>

      {/* 19. FAQ */}
      <section id="faq" className="py-32">
        <div className="studio-container">
          <SectionHeading badge="Вопросы" title="Мы ответим на всё" />
          <div className="max-w-4xl mx-auto space-y-4">
            {[
              { q: "Это медицинская процедура?", a: "Нет. «РЕСУРС» — wellness-студия телесного восстановления. Мы не ставим диагнозы и не заменяем лечение." },
              { q: "Сколько длится Живой Пар?", a: "Основная часть — 15–20 минут. На первый визит лучше заложить 30–40 минут с учётом переодевания и отдыха." },
              { q: "Что такое Синусоида?", a: "Это тренажер мягкого волнового движения, который помогает снять мышечное напряжение и скованность." },
              { q: "Нужно ли что-то брать с собой?", a: "Нет. Мы обеспечиваем гостей всем необходимым: халаты, полотенца, тапочки и вкусный чай." },
              { q: "Можно ли прийти при грыже или других болях?", a: "Наши методики мягкие, но при любых диагнозах позвоночника мы рекомендуем сначала получить одобрение вашего лечащего врача." }
            ].map((item, i) => (
              <details key={i} className="group bg-studio-card rounded-2xl border border-studio-line p-6 cursor-pointer overflow-hidden">
                <summary className="flex justify-between items-center text-lg font-medium list-none">
                  <span>{item.q}</span>
                  <ChevronRight size={20} className="group-open:rotate-90 transition-transform duration-300" />
                </summary>
                <div className="pt-6 text-studio-muted leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 20. Контакты */}
      <section id="contacts" className="py-32 bg-studio-bg overflow-hidden border-t border-studio-line">
        <div className="studio-container">
          <div className="grid lg:grid-cols-2 gap-32">
            <div>
              <SectionHeading badge="Локация" title="Ждём в гости" />
              <div className="space-y-12">
                <div className="flex gap-8">
                  <MapPin className="text-studio-accent" size={32} />
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-studio-muted mb-2">Адрес</div>
                    <div className="text-2xl">Альметьевск, ул. Ленина, д. 100</div>
                    <p className="mt-2 text-studio-muted italic font-light">Удобная парковка всегда свободна</p>
                  </div>
                </div>
                <div className="flex gap-8">
                  <Clock className="text-studio-accent" size={32} />
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-studio-muted mb-2">График</div>
                    <div className="text-2xl">Ежедневно: 09:00 — 21:00</div>
                    <p className="mt-2 text-studio-muted italic font-light">По предварительной записи</p>
                  </div>
                </div>
                <div className="flex gap-8">
                  <Phone className="text-studio-accent" size={32} />
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-studio-muted mb-2">Связь</div>
                    <a href="tel:+79000000000" className="text-2xl block hover:text-studio-accent transition-colors">+7 (900) 000-00-00</a>
                    <a href={WHATSAPP_LINK} className="mt-3 text-studio-accent font-bold uppercase tracking-widest text-[10px] border-b border-studio-accent">Написать в WhatsApp</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative group grayscale-[80%] hover:grayscale-0 transition-all duration-700">
              <div className="aspect-[4/5] bg-studio-ink/10 rounded-[60px] overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=2566&auto=format&fit=crop" 
                  alt="Map Location" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-studio-ink/20 group-hover:bg-transparent transition-all"></div>
              <Button href="#" className="absolute bottom-10 right-10 !bg-white !text-studio-ink shadow-2xl">Открыть маршрут</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-white border-t border-studio-line">
        <div className="studio-container flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-studio-ink flex items-center justify-center text-white">
                <span className="font-serif font-bold text-lg">Р</span>
              </div>
              <span className="font-serif text-xl tracking-widest font-medium uppercase text-studio-ink">Ресурс</span>
            </div>
            <p className="text-xs text-studio-muted leading-relaxed uppercase tracking-widest font-bold">
              Wellness-студия телесного восстановления в Альметьевске
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-20">
            <div className="space-y-4">
              <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-studio-muted mb-4">Навигация</div>
              <a href="#services" className="block text-sm hover:text-studio-accent">Услуги</a>
              <a href="#audience" className="block text-sm hover:text-studio-accent">Кому подходит</a>
              <a href="#pricing" className="block text-sm hover:text-studio-accent">Цены</a>
            </div>
            <div className="space-y-4">
               <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-studio-muted mb-4">Клиентам</div>
              <a href="#faq" className="block text-sm hover:text-studio-accent">FAQ</a>
              <a href="#contacts" className="block text-sm hover:text-studio-accent">Контакты</a>
              <a href={WHATSAPP_LINK} className="block text-sm hover:text-studio-accent">WhatsApp</a>
            </div>
          </div>
        </div>
        
        <div className="studio-container mt-20 pt-8 border-t border-studio-line text-center">
            <p className="text-[10px] text-studio-muted/40 max-w-3xl mx-auto leading-loose italic">
              Информация на сайте не является медицинской рекомендацией. Услуги студии «РЕСУРС» не являются медицинскими услугами, не предполагают диагностику и лечение заболеваний и не заменяют консультацию врача. Возможны индивидуальные противопоказания.
            </p>
            <p className="mt-8 text-[9px] uppercase tracking-widest text-studio-muted">© 2026 РЕСУРС студия телесного восстановления</p>
        </div>
      </footer>

      {/* AI Assistant Widget Interface */}
      <div className="fixed bottom-8 right-8 z-[60]">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAiOpen(!isAiOpen)}
          className="w-16 h-16 rounded-full bg-studio-accent text-white shadow-2xl flex items-center justify-center hover:bg-studio-ink transition-colors relative"
        >
          {isAiOpen ? <X /> : <MessageCircle />}
          {!isAiOpen && (
            <span className="absolute -top-2 -right-2 bg-studio-ink text-white text-[8px] px-2 py-1 rounded-full animate-bounce uppercase tracking-tighter">AI</span>
          )}
        </motion.button>

        <AnimatePresence>
          {isAiOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="absolute bottom-20 right-0 w-[350px] md:w-[400px] h-[600px] bg-studio-bg rounded-[32px] shadow-2xl border border-studio-line flex flex-col overflow-hidden"
            >
              {/* AI Header */}
              <div className="p-6 bg-studio-ink text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-studio-accent flex items-center justify-center">
                     <Bot size={24} />
                   </div>
                   <div>
                     <div className="text-sm font-bold uppercase tracking-widest">Ассистент</div>
                     <div className="text-[10px] opacity-60">Спокойно отвечу на вопросы</div>
                   </div>
                </div>
                <button onClick={() => setIsAiOpen(false)}><X size={20} /></button>
              </div>

              {/* AI Messages */}
              <div 
                ref={chatContainerRef}
                className="flex-1 p-6 overflow-y-auto space-y-6 scroll-smooth"
              >
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      msg.role === 'assistant' ? 'bg-studio-accent/20 text-studio-accent' : 'bg-studio-ink text-white'
                    }`}>
                      {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
                    </div>
                    <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'assistant' 
                        ? 'bg-white rounded-tl-none' 
                        : 'bg-studio-accent text-white rounded-tr-none'
                    }`}>
                      {msg.text || (msg.role === 'assistant' && isTyping && !msg.text ? <Loader2 size={16} className="animate-spin" /> : '')}
                    </div>
                  </div>
                ))}

                {!isTyping && messages.length <= 2 && (
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Что выбрать впервые?",
                      "Что такое Живой Пар?",
                      "Сколько длится визит?",
                      "Есть противопоказания?",
                      "Сколько стоит?",
                      "Записаться в WhatsApp"
                    ].map((chip) => (
                      <button 
                        key={chip} 
                        onClick={() => handleSendMessage(chip)}
                        className="px-4 py-2 bg-white border border-studio-line rounded-full text-xs hover:border-studio-accent transition-colors shadow-sm"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}
                
                {isTyping && messages[messages.length - 1].text === '' && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-studio-accent/20 flex items-center justify-center text-studio-accent shrink-0">
                      <Bot size={16} />
                    </div>
                    <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                      <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-studio-muted rounded-full" />
                      <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-studio-muted rounded-full" />
                      <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-studio-muted rounded-full" />
                    </div>
                  </div>
                )}
              </div>

              {/* AI Input */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(inputValue);
                }}
                className="p-6 bg-white border-t border-studio-line"
              >
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ваш вопрос..." 
                    className="flex-1 bg-studio-bg border-none rounded-full px-5 py-3 text-sm focus:ring-1 focus:ring-studio-accent"
                    disabled={isTyping}
                  />
                  <button 
                    type="submit"
                    disabled={isTyping || !inputValue.trim()}
                    className="w-11 h-11 rounded-full bg-studio-accent text-white flex items-center justify-center disabled:opacity-50 disabled:grayscale transition-all"
                  >
                    {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                  </button>
                </div>
                <p className="mt-4 text-[9px] text-center text-studio-muted opacity-50 uppercase tracking-[0.2em] font-bold">
                  Ассистент не дает медицинских советов
                </p>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
