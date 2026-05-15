import { useState, useEffect, useRef } from "react";
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
  Loader2,
  Globe,
  ExternalLink,
  Zap,
  Coffee
} from "lucide-react";
import { translations, Language } from "./locales";

const WHATSAPP_LINK = "https://wa.me/79000000000";
const MAP_LINK = "https://yandex.ru/maps/-/CCU8v8V8XD"; // Example real route

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
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('resurs_lang');
    return (saved as Language) || 'ru';
  });

  const t = translations[lang];

  useEffect(() => {
    localStorage.setItem('resurs_lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);

  // AI Chat State
  const [messages, setMessages] = useState<any[]>([
    { id: '1', role: 'assistant', text: t.assistant.welcome }
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
    const assistantId = (Date.now() + 1).toString();
    
    const history = messages
      .filter((msg, index) => !(index === 0 && msg.role === 'assistant'))
      .map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.text || '' }]
      }));

    setMessages(prev => [...prev, userMessage, { id: assistantId, role: 'assistant', text: '' }]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history, lang })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Ошибка API");
      }

      const assistantText = await response.text();
      
      setMessages(prev => prev.map(msg => 
        msg.id === assistantId ? { ...msg, text: assistantText } : msg
      ));
    } catch (error: any) {
      console.error("AI Error:", error);
      setMessages(prev => prev.map(msg => 
        msg.id === assistantId 
          ? { ...msg, text: `К сожалению, произошла ошибка: ${error.message}. Пожалуйста, попробуйте позже или напишите нам напрямую в WhatsApp.` } 
          : msg
      ));
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
            <span className="font-serif text-2xl tracking-[0.2em] font-medium uppercase text-studio-ink">{t.common.title}</span>
          </div>

          <div className="hidden lg:flex items-center gap-8 text-[10px] uppercase tracking-[0.25em] font-bold text-studio-muted">
            <a href="#services" className="hover:text-studio-accent transition-colors">{t.nav.services}</a>
            <a href="#audience" className="hover:text-studio-accent transition-colors">{t.nav.audience}</a>
            <a href="#process" className="hover:text-studio-accent transition-colors">{t.nav.process}</a>
            <a href="#pricing" className="hover:text-studio-accent transition-colors">{t.nav.pricing}</a>
            <a href="#reviews" className="hover:text-studio-accent transition-colors">{t.nav.reviews}</a>
            <a href="#faq" className="hover:text-studio-accent transition-colors">{t.nav.faq}</a>
            <a href="#contacts" className="hover:text-studio-accent transition-colors">{t.nav.contacts}</a>
            
            <div className="flex items-center gap-2 border-l border-studio-line pl-6 ml-2">
              <button 
                onClick={() => setLang('ru')}
                className={`transition-colors ${lang === 'ru' ? 'text-studio-accent' : 'hover:text-studio-accent'}`}
              >
                RU
              </button>
              <span className="opacity-20 italic">|</span>
              <button 
                onClick={() => setLang('tt')}
                className={`transition-colors ${lang === 'tt' ? 'text-studio-accent' : 'hover:text-studio-accent'}`}
              >
                TT
              </button>
            </div>
            
            <Button href={WHATSAPP_LINK} target="_blank" className="!px-6 !py-2.5">{t.nav.book}</Button>
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
              <div className="flex flex-col p-8 gap-5 text-[12px] uppercase tracking-[0.3em] font-bold text-center">
                <a href="#services" onClick={() => setMobileMenuOpen(false)}>{t.nav.services}</a>
                <a href="#audience" onClick={() => setMobileMenuOpen(false)}>{t.nav.audience}</a>
                <a href="#process" onClick={() => setMobileMenuOpen(false)}>{t.nav.process}</a>
                <a href="#pricing" onClick={() => setMobileMenuOpen(false)}>{t.nav.pricing}</a>
                <a href="#reviews" onClick={() => setMobileMenuOpen(false)}>{t.nav.reviews}</a>
                <a href="#faq" onClick={() => setMobileMenuOpen(false)}>{t.nav.faq}</a>
                <a href="#contacts" onClick={() => setMobileMenuOpen(false)}>{t.nav.contacts}</a>
                
                <div className="flex justify-center items-center gap-4 py-2 border-y border-studio-line">
                  <button onClick={() => { setLang('ru'); setMobileMenuOpen(false); }} className={lang === 'ru' ? 'text-studio-accent' : ''}>RU</button>
                  <span className="opacity-20 italic">|</span>
                  <button onClick={() => { setLang('tt'); setMobileMenuOpen(false); }} className={lang === 'tt' ? 'text-studio-accent' : ''}>TT</button>
                </div>
                
                <Button href={WHATSAPP_LINK} target="_blank">{t.nav.book}</Button>
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
              {t.hero.badge}
            </span>
            <h1 className="text-5xl md:text-8xl lg:text-9xl font-light leading-[1.05] tracking-tighter mb-10">
              {t.hero.h1.split(' ')[0]} {t.hero.h1.split(' ')[1]} <br />
              <span className="italic-serif text-studio-accent">{t.hero.h1.split(' ').slice(2).join(' ')}</span>
            </h1>
            <p className="max-w-xl text-lg md:text-xl text-studio-ink font-light leading-relaxed mb-10">
              {t.hero.subtitle}
            </p>
            
            <div className="p-5 border-l-2 border-studio-accent/20 mb-12 bg-white/10 backdrop-blur-sm rounded-r-2xl max-w-xl">
               <p className="text-sm italic text-studio-muted">
                {t.hero.disclaimer}
               </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
              <Button href={WHATSAPP_LINK} target="_blank" className="!px-10 !py-5 shadow-2xl">
                {t.hero.cta}
              </Button>
              <Button onClick={() => setIsAiOpen(true)} variant="secondary" className="!px-10 !py-5">
                {t.hero.ctaAssistant}
              </Button>
            </div>
            
            {/* 6.3 Быстрые факты */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 lg:mt-24">
              {[
                { icon: Waves, text: t.facts[0] },
                { icon: Clock, text: t.facts[1] },
                { icon: MapPin, text: t.facts[2] },
                { icon: Heart, text: t.facts[3] }
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

      {/* 8. Блок «Чем мы отличаемся» */}
      <section className="py-24 bg-studio-card border-b border-studio-line">
        <div className="studio-container">
          <div className="max-w-5xl">
            <h2 className="text-3xl md:text-5xl font-light mb-8 leading-tight">
              {t.different.title}
            </h2>
            <p className="text-xl md:text-2xl text-studio-muted font-light leading-relaxed">
              {t.different.text}
            </p>
          </div>
        </div>
      </section>

      {/* 5. Главный продающий блок: Комплекс */}
      <section className="py-24 bg-studio-ink text-white">
        <div className="studio-container">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <span className="text-studio-accent text-[11px] uppercase tracking-[0.4em] font-bold mb-6 block">{t.recharge.badge}</span>
              <h2 className="text-5xl md:text-7xl font-light mb-8">{t.recharge.title}</h2>
              <p className="text-xl text-white/70 font-light leading-relaxed mb-12">
                {t.recharge.p1} <span className="text-white font-medium underline underline-offset-8 font-serif italic text-lg">{t.services.steam.title}</span> {t.recharge.p2} <span className="text-white font-medium underline underline-offset-8 font-serif italic text-lg">{t.services.sinus.title}</span> {t.recharge.p3}
              </p>
              
              <div className="grid grid-cols-2 gap-10 mb-12">
                <div className="space-y-2">
                  <div className="text-[10px] uppercase tracking-widest opacity-50">{t.recharge.activeTimeLabel}</div>
                  <div className="text-3xl font-serif italic text-studio-accent">{t.recharge.activeTimeValue}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-[10px] uppercase tracking-widest opacity-50">{t.recharge.fullVisitLabel}</div>
                  <div className="text-3xl font-serif italic text-studio-accent">{t.recharge.fullVisitValue}</div>
                </div>
              </div>

              <div className="space-y-4">
                <Button href={WHATSAPP_LINK} className="w-full sm:w-auto !bg-studio-accent hover:!bg-white hover:text-studio-ink">{t.recharge.cta}</Button>
                <p className="text-[10px] opacity-40 uppercase tracking-widest">{t.common.nonMedical}</p>
              </div>
            </div>
            <div className="relative">
               <div className="aspect-square rounded-[60px] overflow-hidden">
                 <img 
                  src="https://images.unsplash.com/photo-1591343395902-1adcb454c7e7?q=80&w=2574&auto=format&fit=crop" 
                  alt="РЕСУРС" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                 />
               </div>
               <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-white/10 backdrop-blur-2xl rounded-full border border-white/10 flex items-center justify-center p-6 text-center animate-pulse-slow">
                 <span className="font-serif italic text-xl">{t.recharge.floatingNote}</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Важная рамка (Prominent Important Frame) */}
      <section className="py-12 bg-studio-bg">
        <div className="studio-container">
          <div className="p-10 md:p-16 bg-studio-accent/5 border-2 border-dashed border-studio-accent/20 rounded-[50px] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-studio-accent/5 rounded-bl-full"></div>
            <div className="relative z-10 max-w-4xl mx-auto flex flex-col md:flex-row gap-10 items-center">
              <div className="w-20 h-20 rounded-full bg-studio-accent text-white flex items-center justify-center shrink-0">
                <Zap size={36} />
              </div>
              <div>
                <h4 className="text-2xl md:text-3xl font-serif italic mb-4 text-studio-ink">{t.importantFrame.title}</h4>
                <p className="text-studio-muted leading-relaxed">
                  {t.importantFrame.text}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Блок «Для кого РЕСУРС» */}
      <section id="audience" className="py-32 bg-white">
        <div className="studio-container">
          <SectionHeading 
            badge={t.audience.badge}
            title={t.audience.title}
            subtitle={t.audience.subtitle}
          />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {t.audience.cards.map((card, i) => (
              <div key={i} className="group p-10 bg-studio-card border border-studio-line rounded-[40px] hover:border-studio-accent transition-all duration-500 flex flex-col justify-between">
                <div>
                  <h4 className="text-2xl font-serif mb-4 italic">{card.title}</h4>
                  <p className="text-studio-muted text-sm leading-relaxed mb-8">{card.p}</p>
                </div>
                <div className="pt-8 border-t border-studio-line">
                  <div className="text-[10px] uppercase tracking-widest text-studio-accent font-bold mb-2">{t.common.recommendationLabel}</div>
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
          <SectionHeading badge={t.services.badge} title={t.services.title} />
          
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
                <h3 className="text-4xl md:text-6xl font-light mb-8">{t.services.steam.title}</h3>
                <p className="text-xl font-light text-studio-muted leading-relaxed mb-8">
                  {t.services.steam.p}
                </p>
                <div className="flex gap-10 mb-10">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-studio-muted mb-2">{t.common.timeLabel}</div>
                    <div className="text-2xl font-serif">{t.services.steam.time}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-studio-muted mb-2">{t.common.taglineLabel}</div>
                    <div className="text-2xl font-serif">{t.services.steam.temp}</div>
                  </div>
                </div>
                <Button variant="secondary" href={WHATSAPP_LINK} target="_blank">{t.services.steam.cta}</Button>
              </div>
            </div>

            {/* Синусоида */}
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="order-2 md:order-1">
                <Wind className="text-studio-accent mb-8" size={40} />
                <h3 className="text-4xl md:text-6xl font-light mb-8">{t.services.sinus.title}</h3>
                <p className="text-xl font-light text-studio-muted leading-relaxed mb-8">
                  {t.services.sinus.p}
                </p>
                <div className="flex gap-10 mb-10">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-studio-muted mb-2">{t.common.timeLabel}</div>
                    <div className="text-2xl font-serif">{t.services.sinus.time}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-studio-muted mb-2">{t.common.effectLabel}</div>
                    <div className="text-2xl font-serif">{t.services.sinus.effect}</div>
                  </div>
                </div>
                <Button variant="secondary" href={WHATSAPP_LINK} target="_blank">{t.services.sinus.cta}</Button>
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
                <h3 className="text-4xl md:text-6xl font-light mb-8">{t.services.massage.title}</h3>
                <p className="text-xl font-light text-studio-muted leading-relaxed mb-8">
                  {t.services.massage.p}
                </p>
                <div className="flex gap-10 mb-10">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-studio-muted mb-2">{t.common.timeLabel}</div>
                    <div className="text-2xl font-serif">{t.services.massage.time}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-studio-muted mb-2">{t.common.techniqueLabel}</div>
                    <div className="text-2xl font-serif">{t.services.massage.technique}</div>
                  </div>
                </div>
                <Button variant="secondary" href={WHATSAPP_LINK} target="_blank">{t.services.massage.cta}</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 14. Как проходит первый визит */}
      <section id="process" className="py-32 bg-studio-card border-y border-studio-line">
        <div className="studio-container">
          <SectionHeading badge={t.process.badge} title={t.process.title} />
          
          <div className="grid md:grid-cols-3 gap-12">
            {t.process.steps.map((step, i) => (
              <div key={i} className="flex gap-6">
                <div className="w-12 h-12 rounded-full border border-studio-accent/30 flex items-center justify-center shrink-0 font-serif italic text-studio-accent text-xl">
                  {step.s}
                </div>
                <div>
                  <h4 className="text-xl font-serif italic mb-2 uppercase tracking-wide">{step.t}</h4>
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
          <SectionHeading badge={t.pricing.badge} title={t.pricing.title} />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.pricing.items.map((item, i) => (
              <div key={i} className={`p-8 rounded-[40px] border flex flex-col justify-between ${
                item.popular ? "bg-studio-ink text-white border-studio-ink scale-105 shadow-2xl" : "bg-studio-card border-studio-line"
              }`}>
                <div>
                  <div className="text-[10px] uppercase tracking-widest opacity-50 mb-4">{item.title}</div>
                  <div className="text-3xl font-serif mb-4 italic">{item.price}</div>
                  <p className={`text-sm mb-8 ${item.popular ? "text-white/60" : "text-studio-muted"}`}>{item.desc}</p>
                </div>
                <Button 
                  href={WHATSAPP_LINK}
                  target="_blank"
                  variant={item.popular ? "outline" : "secondary"}
                  className={`w-full !px-4 ${item.popular ? "!border-white !text-white hover:!bg-white hover:!text-studio-ink" : ""}`}
                >
                  {item.cta}
                </Button>
              </div>
            ))}
          </div>
          
          {/* 17. Корпоративный блок */}
          <div className="mt-20 p-12 bg-studio-accent rounded-[50px] text-white overflow-hidden relative">
            <div className="relative z-10 max-w-2xl">
              <h3 className="text-3xl md:text-5xl font-light mb-6">{t.pricing.corporate.title}</h3>
              <p className="text-lg opacity-80 mb-10">{t.pricing.corporate.text}</p>
              <Button href={WHATSAPP_LINK} target="_blank" className="!bg-white !text-studio-accent">{t.pricing.corporate.cta}</Button>
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
               <h4 className="text-3xl font-serif italic mb-4">{t.safety.title}</h4>
               <p className="text-studio-muted leading-relaxed italic">
                 {t.safety.text}
               </p>
             </div>
          </div>
        </div>
      </section>

      {/* 19. FAQ */}
      <section id="faq" className="py-32">
        <div className="studio-container">
          <SectionHeading badge={t.faq.badge} title={t.faq.title} />
          <div className="max-w-4xl mx-auto space-y-4">
            {t.faq.items.map((item, i) => (
              <details key={i} className="group bg-studio-card rounded-2xl border border-studio-line p-6 cursor-pointer overflow-hidden">
                <summary className="flex justify-between items-center text-lg font-medium list-none">
                  <span className="font-serif italic pr-4">{item.q}</span>
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

      {/* 20. Отзывы */}
      <section id="reviews" className="py-32 bg-white">
        <div className="studio-container">
          <SectionHeading badge={t.reviews.badge} title={t.reviews.title} />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {t.reviews.items.map((review, i) => (
              <div key={i} className="p-10 bg-studio-card border border-studio-line rounded-[40px] flex flex-col justify-between">
                <div>
                   <div className="flex gap-1 mb-6">
                     {[...Array(5)].map((_, i) => (
                       <Heart key={i} size={14} className="fill-studio-accent text-studio-accent" />
                     ))}
                   </div>
                   <p className="text-studio-ink text-sm leading-relaxed italic mb-8">"{review.text}"</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-studio-accent/20 flex items-center justify-center text-studio-accent font-serif font-bold italic">
                    {review.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-bold uppercase tracking-wider">{review.name}</div>
                    <div className="text-[10px] text-studio-muted uppercase tracking-widest">{review.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 21. Контакты */}
      <section id="contacts" className="py-32 bg-studio-bg overflow-hidden border-t border-studio-line">
        <div className="studio-container">
          <div className="grid lg:grid-cols-2 gap-32">
            <div>
              <SectionHeading badge={t.contacts.badge} title={t.contacts.title} />
              <div className="space-y-12">
                <div className="flex gap-8">
                  <MapPin className="text-studio-accent" size={32} />
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-studio-muted mb-2">{t.contacts.addressLabel}</div>
                    <div className="text-2xl font-serif italic">{t.contacts.addressValue}</div>
                    <p className="mt-2 text-studio-muted italic font-light">{t.contacts.parkingNote}</p>
                  </div>
                </div>
                <div className="flex gap-8">
                  <Clock className="text-studio-accent" size={32} />
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-studio-muted mb-2">{t.contacts.hoursLabel}</div>
                    <div className="text-2xl font-serif italic">{t.contacts.hoursValue}</div>
                    <p className="mt-2 text-studio-muted italic font-light">{t.contacts.bookingNote}</p>
                  </div>
                </div>
                <div className="flex gap-8">
                  <Phone className="text-studio-accent" size={32} />
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-studio-muted mb-2">{t.contacts.phoneLabel}</div>
                    <a href="tel:+79000000000" className="text-2xl font-serif italic block hover:text-studio-accent transition-colors">+7 (900) 000-00-00</a>
                    <a href={WHATSAPP_LINK} target="_blank" className="mt-3 text-studio-accent font-bold uppercase tracking-widest text-[10px] border-b border-studio-accent inline-block">{t.contacts.whatsappCta}</a>
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
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute inset-0 bg-studio-ink/20 group-hover:bg-transparent transition-all"></div>
              <Button href={MAP_LINK} target="_blank" className="absolute bottom-10 right-10 !bg-white !text-studio-ink shadow-2xl flex items-center gap-2">
                {t.contacts.routeCta} <ExternalLink size={14} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-white border-t border-studio-line">
        <div className="studio-container flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-studio-accent flex items-center justify-center text-white">
                <span className="font-serif font-bold text-lg">Р</span>
              </div>
              <span className="font-serif text-xl tracking-widest font-medium uppercase text-studio-ink">{t.common.title}</span>
            </div>
            <p className="text-xs text-studio-muted leading-relaxed uppercase tracking-widest font-bold">
              {t.footer.description}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-10 md:gap-20">
            <div className="space-y-4">
              <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-studio-muted mb-4">{t.footer.navLabel}</div>
              <a href="#services" className="block text-sm hover:text-studio-accent transition-colors">{t.nav.services}</a>
              <a href="#audience" className="block text-sm hover:text-studio-accent transition-colors">{t.nav.audience}</a>
              <a href="#pricing" className="block text-sm hover:text-studio-accent transition-colors">{t.nav.pricing}</a>
            </div>
            <div className="space-y-4">
               <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-studio-muted mb-4">{t.footer.clientsLabel}</div>
              <a href="#faq" className="block text-sm hover:text-studio-accent transition-colors">{t.nav.faq}</a>
              <a href="#contacts" className="block text-sm hover:text-studio-accent transition-colors">{t.nav.contacts}</a>
              <a href={WHATSAPP_LINK} target="_blank" className="block text-sm hover:text-studio-accent transition-colors">WhatsApp</a>
            </div>
          </div>
        </div>
        
        <div className="studio-container mt-20 pt-8 border-t border-studio-line text-center">
            <p className="text-[10px] text-studio-muted/40 max-w-3xl mx-auto leading-loose italic">
              {t.footer.legal}
            </p>
            <p className="mt-8 text-[9px] uppercase tracking-widest text-studio-muted">© 2026 {t.footer.copyright}</p>
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
                     <div className="text-sm font-bold uppercase tracking-widest">{t.assistant.label}</div>
                     <div className="text-[10px] opacity-60 font-serif italic">{t.assistant.subtitle}</div>
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
                        ? 'bg-white rounded-tl-none font-light italic' 
                        : 'bg-studio-accent text-white rounded-tr-none'
                    }`}>
                      {msg.text || (msg.role === 'assistant' && isTyping && !msg.text ? <Loader2 size={16} className="animate-spin" /> : '')}
                    </div>
                  </div>
                ))}

                {!isTyping && messages.length <= 2 && (
                  <div className="flex flex-wrap gap-2">
                    {t.assistant.chips.map((chip) => (
                      <button 
                        key={chip} 
                        onClick={() => handleSendMessage(chip)}
                        className="px-4 py-2 bg-white border border-studio-line rounded-full text-[10px] uppercase tracking-widest hover:border-studio-accent transition-colors shadow-sm font-bold"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}
                
                {isTyping && messages.length > 0 && messages[messages.length - 1]?.text === '' && (
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
                    placeholder={t.assistant.inputPlaceholder} 
                    className="flex-1 bg-studio-bg border-none rounded-full px-5 py-3 text-sm focus:ring-1 focus:ring-studio-accent font-light"
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
                  {t.assistant.disclaimer}
                </p>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
