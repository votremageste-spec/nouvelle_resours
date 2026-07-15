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
  Coffee,
  Sparkles,
  Gift,
  Compass,
  MessageSquare
} from "lucide-react";
import { translations, Language } from "./locales";

const WHATSAPP_LINK = "https://wa.me/79172343434";
const TELEGRAM_LINK = "https://t.me/resours_studio_bot";
const VK_LINK = "https://vk.com/";
const MAKS_LINK = "https://t.me/resours_studio_bot?start=maks"; // Linked Maks assistant
const MAP_LINK = "https://yandex.ru/maps/?text=Альметьевск,+ул.+Чернышевского+31";

// Analytics Event Tracking Helper
const trackEvent = (eventName: string, data?: any) => {
  console.log(`[Analytics Event] ${eventName}`, data || '');
  if (typeof (window as any).ym !== 'undefined') {
    (window as any).ym(99999999, 'reachGoal', eventName, data);
  }
  if (typeof (window as any).gtag !== 'undefined') {
    (window as any).gtag('event', eventName, data);
  }
};

// --- Components ---

const LakhovskyImage = ({ t }: { t: any }) => {
  const [srcIndex, setSrcIndex] = useState(0);
  const possibleSrcs = [
    "/lakhovsky.png",
    "https://lh3.googleusercontent.com/d/1mCoIQ9Aa83720wbMT1LvEpq0B8BmY56-",
    "https://docs.google.com/uc?export=view&id=1mCoIQ9Aa83720wbMT1LvEpq0B8BmY56-",
    "https://drive.google.com/uc?export=view&id=1mCoIQ9Aa83720wbMT1LvEpq0B8BmY56-",
    "/lakhovsky.jpg",
    "/Осциллятор.jpg",
    "/Осциллятор.png",
    "/Осциллятор.jpeg",
    "/Осциллятор.webp",
    "/assets/Осциллятор.jpg",
    "/assets/Осциллятор.png",
    "/src/assets/Осциллятор.jpg",
    "/src/assets/Осциллятор.png",
    "/oscillator.jpg",
    "/oscillator.png"
  ];

  const handleImageError = () => {
    if (srcIndex < possibleSrcs.length) {
      setSrcIndex(srcIndex + 1);
    }
  };

  const currentSrc = possibleSrcs[srcIndex];

  // If we are trying the Google Drive URLs and it fails, let's show a little helper.
  // We'll also render the image or the beautiful vector SVG fallback.
  if (srcIndex >= possibleSrcs.length) {
    return (
      <div className="w-full h-full bg-[#111111] flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
        {/* Ambient background glow */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#CD7F32] via-transparent to-transparent animate-pulse duration-3000"></div>
        
        {/* The Lakhovsky MWO Antenna SVG */}
        <div className="w-4/5 h-4/5 max-h-[280px] max-w-[280px] relative z-10 flex items-center justify-center">
          <svg viewBox="0 0 200 200" className="w-full h-full filter drop-shadow-[0_0_20px_rgba(205,127,50,0.55)]">
            {/* The Tripod/Stand base */}
            <line x1="100" y1="120" x2="100" y2="185" stroke="#3A3A3A" strokeWidth="4.5" strokeLinecap="round" />
            <line x1="100" y1="185" x2="65" y2="215" stroke="#222222" strokeWidth="4.5" strokeLinecap="round" />
            <line x1="100" y1="185" x2="135" y2="215" stroke="#222222" strokeWidth="4.5" strokeLinecap="round" />
            <line x1="100" y1="185" x2="100" y2="220" stroke="#1A1A1A" strokeWidth="4.5" strokeLinecap="round" />
            
            {/* Support structural ring */}
            <circle cx="100" cy="100" r="85" fill="none" stroke="#2D2D2D" strokeWidth="1.5" strokeDasharray="4,4" />
            
            {/* Horizontal support bar */}
            <line x1="10" y1="100" x2="190" y2="100" stroke="#333333" strokeWidth="3" strokeLinecap="round" />
            
            {/* Alternating concentric copper ring antennas */}
            {/* Ring 1 (Outer - r=75) - open gap at bottom-right */}
            <path 
              d="M 100 25 A 75 75 0 1 1 99.9 25" 
              fill="none" 
              stroke="url(#copperGrad)" 
              strokeWidth="6" 
              strokeLinecap="round" 
              strokeDasharray="450" 
              strokeDashoffset="18" 
              className="origin-center rotate-[45deg]"
            />
            
            {/* Ring 2 (r=64) - open gap at top-left */}
            <path 
              d="M 100 36 A 64 64 0 1 1 99.9 36" 
              fill="none" 
              stroke="url(#bronzeGrad)" 
              strokeWidth="5" 
              strokeLinecap="round" 
              strokeDasharray="380" 
              strokeDashoffset="15" 
              className="origin-center rotate-[225deg]"
            />
            
            {/* Ring 3 (r=53) - open gap at bottom-right */}
            <path 
              d="M 100 47 A 53 53 0 1 1 99.9 47" 
              fill="none" 
              stroke="url(#copperGrad)" 
              strokeWidth="4.2" 
              strokeLinecap="round" 
              strokeDasharray="320" 
              strokeDashoffset="12" 
              className="origin-center rotate-[45deg]"
            />

            {/* Ring 4 (r=42) - open gap at top-left */}
            <path 
              d="M 100 58 A 42 42 0 1 1 99.9 58" 
              fill="none" 
              stroke="url(#bronzeGrad)" 
              strokeWidth="3.5" 
              strokeLinecap="round" 
              strokeDasharray="250" 
              strokeDashoffset="10" 
              className="origin-center rotate-[225deg]"
            />

            {/* Ring 5 (r=31) - open gap at bottom-right */}
            <path 
              d="M 100 69 A 31 31 0 1 1 99.9 69" 
              fill="none" 
              stroke="url(#copperGrad)" 
              strokeWidth="2.8" 
              strokeLinecap="round" 
              strokeDasharray="180" 
              strokeDashoffset="8" 
              className="origin-center rotate-[45deg]"
            />

            {/* Ring 6 (Inner - r=20) - open gap at top-left */}
            <path 
              d="M 100 80 A 20 20 0 1 1 99.9 80" 
              fill="none" 
              stroke="url(#bronzeGrad)" 
              strokeWidth="2.2" 
              strokeLinecap="round" 
              strokeDasharray="120" 
              strokeDashoffset="6" 
              className="origin-center rotate-[225deg]"
            />

            {/* Central glowing brass core */}
            <circle cx="100" cy="100" r="9" fill="url(#brassGrad)" className="animate-pulse" />
            <circle cx="100" cy="100" r="4" fill="#FFFFFF" className="opacity-90" />

            {/* Gradients */}
            <defs>
              <linearGradient id="copperGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#CD7F32" />
                <stop offset="50%" stopColor="#E99C5D" />
                <stop offset="100%" stopColor="#8A4A1C" />
              </linearGradient>
              <linearGradient id="bronzeGrad" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#B87333" />
                <stop offset="30%" stopColor="#E1A97A" />
                <stop offset="70%" stopColor="#9C5425" />
                <stop offset="100%" stopColor="#5C3114" />
              </linearGradient>
              <radialGradient id="brassGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFF4BC" />
                <stop offset="50%" stopColor="#E7C250" />
                <stop offset="100%" stopColor="#B28E13" />
              </radialGradient>
            </defs>
          </svg>
        </div>
        
        {/* Caption/Label */}
        <div className="absolute bottom-6 left-6 right-6 text-center z-10">
          <p className="font-serif text-[#CD7F32] text-sm italic font-light tracking-wide">{t.services.lakhovsky.title}</p>
          <p className="text-[9px] text-white/50 uppercase tracking-[0.2em] mt-1">Схемотехника и Резонанс</p>
        </div>
      </div>
    );
  }

  return (
    <img 
      src={currentSrc} 
      alt="Lakhovsky Oscillator" 
      onError={handleImageError}
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      referrerPolicy="no-referrer"
    />
  );
};


const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '', 
  href,
  target
}: any) => {
  const baseStyles = "px-8 py-4 rounded-full font-sans text-[11px] uppercase tracking-[0.2em] font-bold transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer min-h-[48px]";
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

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    if (urlLang === 'ru' || urlLang === 'tt') return urlLang as Language;
    
    const saved = localStorage.getItem('resurs_lang');
    return (saved as Language) || 'ru';
  });

  const t = translations[lang];

  useEffect(() => {
    localStorage.setItem('resurs_lang', lang);
    document.documentElement.lang = lang;
    
    // Sync URL without reloading
    const params = new URLSearchParams(window.location.search);
    if (params.get('lang') !== lang) {
      params.set('lang', lang);
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, '', newUrl);
    }

    // Dynamic SEO Alternate tags
    let linkRu = document.querySelector('link[hreflang="ru"]');
    if (!linkRu) {
      linkRu = document.createElement('link');
      linkRu.setAttribute('rel', 'alternate');
      linkRu.setAttribute('hreflang', 'ru');
      document.head.appendChild(linkRu);
    }
    linkRu.setAttribute('href', `${window.location.origin}${window.location.pathname}?lang=ru`);

    let linkTt = document.querySelector('link[hreflang="tt"]');
    if (!linkTt) {
      linkTt = document.createElement('link');
      linkTt.setAttribute('rel', 'alternate');
      linkTt.setAttribute('hreflang', 'tt');
      document.head.appendChild(linkTt);
    }
    linkTt.setAttribute('href', `${window.location.origin}${window.location.pathname}?lang=tt`);
  }, [lang]);

  const changeLanguage = (newLang: Language) => {
    setLang(newLang);
    trackEvent(`switch_language_${newLang}`);
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);

  // Calculator State
  const [calcServices, setCalcServices] = useState<{ [key: string]: boolean }>({
    steam_sinus: true,
    massage: false,
    lakhovsky: false
  });

  const calcData = {
    steam_sinus: { price: 2000, time: 30 },
    massage: { price: 3500, time: 60 },
    lakhovsky: { price: 1500, time: 10 }
  };

  const totalCalcPrice = Object.entries(calcServices)
    .reduce((sum, [key, selected]) => selected ? sum + (calcData[key as keyof typeof calcData]?.price || 0) : sum, 0);

  const totalCalcTime = Object.entries(calcServices)
    .reduce((sum, [key, selected]) => selected ? sum + (calcData[key as keyof typeof calcData]?.time || 0) : sum, 0);

  const handleSendCalculatorToWhatsApp = () => {
    trackEvent('click_calculator_send_whatsapp');
    const selectedItems = Object.entries(calcServices)
      .filter(([_, selected]) => selected)
      .map(([key]) => {
        const name = t.calculator.services[key as keyof typeof t.calculator.services];
        const time = calcData[key as keyof typeof calcData]?.time;
        const price = calcData[key as keyof typeof calcData]?.price;
        return `- ${name} (${time} ${t.calculator.timeSuffix}, ${price} ₽)`;
      });

    if (selectedItems.length === 0) return;

    const intro = lang === 'tt' 
      ? "Сәламәтсезме! Мин сайтта визит конфигурациясен җыйдым:" 
      : "Здравствуйте! Я собрал конфигурацию визита на сайте:";
    const priceLabel = t.calculator.totalPrice;
    const timeLabel = t.calculator.duration;
    const ctaLabel = lang === 'tt' ? "Язылырга телим." : "Хочу записаться.";

    const text = `${intro}\n${selectedItems.join('\n')}\n\n${priceLabel}: ${totalCalcPrice} ₽\n${timeLabel}: ${totalCalcTime} ${t.calculator.timeSuffix}\n\n${ctaLabel}`;
    
    const url = `${WHATSAPP_LINK}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

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

  // Sync welcome message on language change
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].role === 'assistant') {
        return [{ id: '1', role: 'assistant', text: t.assistant.welcome }];
      }
      return prev;
    });
  }, [lang, t.assistant.welcome]);

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
    <div className="min-h-screen selection:bg-studio-accent/30 bg-studio-bg text-studio-ink">
      
      {/* 1. Header / шапка и навигация */}
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
                onClick={() => changeLanguage('ru')}
                className={`transition-colors cursor-pointer ${lang === 'ru' ? 'text-studio-accent' : 'hover:text-studio-accent'}`}
              >
                RU
              </button>
              <span className="opacity-20 italic">|</span>
              <button 
                onClick={() => changeLanguage('tt')}
                className={`transition-colors cursor-pointer ${lang === 'tt' ? 'text-studio-accent' : 'hover:text-studio-accent'}`}
              >
                TT
              </button>
            </div>
            
            <Button 
              href={WHATSAPP_LINK} 
              target="_blank" 
              onClick={() => trackEvent('click_whatsapp_header')}
              className="!px-6 !py-2.5"
            >
              {t.nav.book}
            </Button>
          </div>

          <button className="lg:hidden text-studio-ink cursor-pointer" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
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
                  <button onClick={() => { changeLanguage('ru'); setMobileMenuOpen(false); }} className={`cursor-pointer ${lang === 'ru' ? 'text-studio-accent' : ''}`}>RU</button>
                  <span className="opacity-20 italic">|</span>
                  <button onClick={() => { changeLanguage('tt'); setMobileMenuOpen(false); }} className={`cursor-pointer ${lang === 'tt' ? 'text-studio-accent' : ''}`}>TT</button>
                </div>
                
                <Button 
                  href={WHATSAPP_LINK} 
                  target="_blank"
                  onClick={() => { trackEvent('click_whatsapp_header'); setMobileMenuOpen(false); }}
                >
                  {t.nav.book}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 2. Hero: «Верни себе ресурс» */}
      <header className="relative min-h-screen flex items-center py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2670&auto=format&fit=crop" 
            alt="" 
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
              <Button 
                href={WHATSAPP_LINK} 
                target="_blank" 
                onClick={() => trackEvent('click_whatsapp_hero')}
                className="!px-10 !py-5 shadow-2xl"
              >
                {t.hero.cta}
              </Button>
              <Button 
                onClick={() => { trackEvent('click_ai_helper'); setIsAiOpen(true); }} 
                variant="secondary" 
                className="!px-10 !py-5"
              >
                {t.hero.ctaAssistant}
              </Button>
            </div>
            
            {/* 3. Быстрые факты */}
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

      {/* 4. Блок «Чем мы отличаемся» */}
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

      {/* 5. Блок «Три пути к восстановлению» */}
      <section id="services" className="py-32 bg-white">
        <div className="studio-container">
          <SectionHeading 
            badge={t.threePaths.badge} 
            title={t.threePaths.title} 
            subtitle={t.threePaths.subtitle} 
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Карточка 1: Живой Пар */}
            <div 
              onClick={() => {
  trackEvent('click_service_steam');
  document.getElementById('steam-details')?.scrollIntoView({
    behavior: 'smooth',
  });
}}
              className="p-10 bg-studio-card border border-studio-line rounded-[40px] flex flex-col justify-between hover:border-studio-accent transition-all duration-500 cursor-pointer group"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-studio-accent/10 flex items-center justify-center text-studio-accent mb-8 group-hover:bg-studio-accent group-hover:text-white transition-colors">
                  <Waves size={24} />
                </div>
                <h3 className="text-2xl font-serif italic mb-6">{t.threePaths.steam.title}</h3>
                <p className="text-studio-muted text-sm leading-relaxed font-light">{t.threePaths.steam.text}</p>
              </div>
              <div className="mt-10 pt-6 border-t border-studio-line flex items-center justify-between text-[10px] uppercase tracking-widest font-bold text-studio-accent">
                <span>{t.common.learnMore}</span>
                <ChevronRight size={14} />
              </div>
            </div>

            {/* Карточка 2: Синусоида */}
            <div 
              onClick={() => {
  trackEvent('click_service_sinus');
  document.getElementById('sinus-details')?.scrollIntoView({
    behavior: 'smooth',
  });
}}
              className="p-10 bg-studio-card border border-studio-line rounded-[40px] flex flex-col justify-between hover:border-studio-accent transition-all duration-500 cursor-pointer group"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-studio-accent/10 flex items-center justify-center text-studio-accent mb-8 group-hover:bg-studio-accent group-hover:text-white transition-colors">
                  <Wind size={24} />
                </div>
                <h3 className="text-2xl font-serif italic mb-6">{t.threePaths.sinus.title}</h3>
                <p className="text-studio-muted text-sm leading-relaxed font-light whitespace-pre-wrap">{t.threePaths.sinus.text}</p>
              </div>
              <div className="mt-10 pt-6 border-t border-studio-line flex items-center justify-between text-[10px] uppercase tracking-widest font-bold text-studio-accent">
                <span>{t.common.learnMore}</span>
                <ChevronRight size={14} />
              </div>
            </div>

            {/* Карточка 3: Массаж */}
            <div 
              onClick={() => {
  trackEvent('click_service_massage');
  document.getElementById('massage-details')?.scrollIntoView({
    behavior: 'smooth',
  });
}}
              className="p-10 bg-studio-card border border-studio-line rounded-[40px] flex flex-col justify-between hover:border-studio-accent transition-all duration-500 cursor-pointer group"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-studio-accent/10 flex items-center justify-center text-studio-accent mb-8 group-hover:bg-studio-accent group-hover:text-white transition-colors">
                  <Hand size={24} />
                </div>
                <h3 className="text-2xl font-serif italic mb-6">{t.threePaths.massage.title}</h3>
                <p className="text-studio-muted text-sm leading-relaxed font-light">{t.threePaths.massage.text}</p>
              </div>
              <div className="mt-10 pt-6 border-t border-studio-line flex items-center justify-between text-[10px] uppercase tracking-widest font-bold text-studio-accent">
                <span>{t.common.learnMore}</span>
                <ChevronRight size={14} />
              </div>
            </div>

            {/* Карточка 4: Осциллятор Лаховского */}
            <div 
              onClick={() => {
                trackEvent('click_service_lakhovsky');
                const el = document.getElementById('lakhovsky');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="p-10 bg-studio-card border border-studio-line rounded-[40px] flex flex-col justify-between hover:border-studio-accent transition-all duration-500 cursor-pointer group"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-studio-accent/10 flex items-center justify-center text-studio-accent mb-8 group-hover:bg-studio-accent group-hover:text-white transition-colors">
                  <Zap size={24} />
                </div>
                <h3 className="text-2xl font-serif italic mb-6">{t.threePaths.lakhovsky.title}</h3>
                <p className="text-studio-muted text-sm leading-relaxed font-light">{t.threePaths.lakhovsky.text}</p>
              </div>
              <div className="mt-10 pt-6 border-t border-studio-line flex items-center justify-between text-[10px] uppercase tracking-widest font-bold text-studio-accent">
                <span>{t.common.learnMore}</span>
                <ChevronRight size={14} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Блок «Живой Пар» */}
      <section
  id="steam-details"
  className="scroll-mt-24 py-24 bg-studio-bg border-t border-studio-line"
>
        <div className="studio-container">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="rounded-[60px] overflow-hidden aspect-[4/3] bg-studio-ink/10 shadow-lg relative group">
              <img 
                src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=2670&auto=format&fit=crop" 
                alt="Living Steam" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-studio-ink/40 to-transparent"></div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Waves className="text-studio-accent" size={32} />
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-studio-muted">Wellness капсула</span>
              </div>
              <h3 className="text-4xl md:text-5xl font-light mb-8">{t.services.steam.title}</h3>
              <p className="text-lg font-light text-studio-muted leading-relaxed mb-8">
                {t.services.steam.p}
              </p>
              <div className="grid grid-cols-3 gap-6 mb-10 p-6 bg-white rounded-3xl border border-studio-line">
                <div>
                  <div className="text-[9px] uppercase tracking-widest text-studio-muted mb-2">{t.common.timeLabel}</div>
                  <div className="text-sm font-semibold text-studio-accent">{t.services.steam.time}</div>
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-widest text-studio-muted mb-2">Температура</div>
                  <div className="text-sm font-semibold text-studio-accent">{t.services.steam.temp}</div>
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-widest text-studio-muted mb-2">Ощущение</div>
                  <div className="text-sm font-semibold text-studio-accent capitalize">{t.services.steam.feeling || "тепло"}</div>
                </div>
              </div>
              <div className="space-y-4">
                <Button 
                  variant="primary" 
                  href={WHATSAPP_LINK} 
                  target="_blank"
                  onClick={() => trackEvent('click_service_steam')}
                >
                  {t.services.steam.cta}
                </Button>
                <p className="text-[9px] text-studio-muted opacity-60 uppercase tracking-wider">{t.services.steam.disclaimer}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Блок «Синусоида» */}
      <section
  id="sinus-details"
  className="scroll-mt-24 py-24 bg-white border-y border-studio-line"
>
        <div className="studio-container">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="flex items-center gap-3 mb-6">
                <Wind className="text-studio-accent" size={32} />
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-studio-muted">Волновое расслабление</span>
              </div>
              <h3 className="text-4xl md:text-5xl font-light mb-8">{t.services.sinus.title}</h3>
              <p className="text-lg font-light text-studio-muted leading-relaxed mb-8">
                {t.services.sinus.p}
              </p>
              <div className="grid grid-cols-2 gap-6 mb-10 p-6 bg-studio-bg rounded-3xl border border-studio-line">
                <div>
                  <div className="text-[9px] uppercase tracking-widest text-studio-muted mb-2">{t.common.timeLabel}</div>
                  <div className="text-sm font-semibold text-studio-accent">{t.services.sinus.time}</div>
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-widest text-studio-muted mb-2">Ощущение после</div>
                  <div className="text-sm font-semibold text-studio-accent">{t.services.sinus.effect}</div>
                </div>
              </div>
              <Button 
                variant="secondary" 
                href={WHATSAPP_LINK} 
                target="_blank"
                onClick={() => trackEvent('click_service_sinusoid')}
              >
                {t.services.sinus.cta}
              </Button>
            </div>
            <div className="order-1 md:order-2 rounded-[60px] overflow-hidden aspect-[4/3] bg-studio-ink/10 shadow-lg relative group">
              <img 
                src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2670&auto=format&fit=crop" 
                alt="Sinusoid" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-studio-ink/40 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Блок «Массаж» */}
      <section
  id="massage-details"
  className="scroll-mt-24 py-24 bg-studio-bg border-b border-studio-line"
>
        <div className="studio-container">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="rounded-[60px] overflow-hidden aspect-[4/3] bg-studio-ink/10 shadow-lg relative group">
              <img 
                src="https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=2670&auto=format&fit=crop" 
                alt="Massage" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-studio-ink/40 to-transparent"></div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Hand className="text-studio-accent" size={32} />
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-studio-muted">Ручной массаж</span>
              </div>
              <h3 className="text-4xl md:text-5xl font-light mb-8">{t.services.massage.title}</h3>
              <p className="text-lg font-light text-studio-muted leading-relaxed mb-8">
                {t.services.massage.p}
              </p>
              <div className="grid grid-cols-2 gap-6 mb-10 p-6 bg-white rounded-3xl border border-studio-line">
                <div>
                  <div className="text-[9px] uppercase tracking-widest text-studio-muted mb-2">{t.common.timeLabel}</div>
                  <div className="text-sm font-semibold text-studio-accent">{t.services.massage.time}</div>
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-widest text-studio-muted mb-2">Техника</div>
                  <div className="text-sm font-semibold text-studio-accent">{t.services.massage.technique}</div>
                </div>
              </div>
              <Button 
                variant="secondary" 
                href={WHATSAPP_LINK} 
                target="_blank"
                onClick={() => trackEvent('click_service_massage')}
              >
                {t.services.massage.cta}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 8.1. Блок «Осциллятор Лаховского» */}
      <section id="lakhovsky" className="py-24 bg-white border-b border-studio-line">
        <div className="studio-container">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="flex items-center gap-3 mb-6">
                <Zap className="text-studio-accent" size={32} />
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-studio-muted">Аппаратный wellness</span>
              </div>
              <h3 className="text-4xl md:text-5xl font-light mb-8">{t.services.lakhovsky.title}</h3>
              <p className="text-lg font-light text-studio-muted leading-relaxed mb-8">
                {t.services.lakhovsky.p}
              </p>
              
              <div className="mb-8 p-6 bg-studio-bg rounded-3xl border border-studio-line space-y-4">
                <h4 className="text-xs font-bold text-studio-ink uppercase tracking-wider">{t.services.lakhovsky.historyTitle}</h4>
                <p className="text-xs font-light text-studio-muted leading-relaxed">{t.services.lakhovsky.historyText}</p>
              </div>

              <div className="grid grid-cols-3 gap-6 mb-10 p-6 bg-studio-bg rounded-3xl border border-studio-line">
                <div>
                  <div className="text-[9px] uppercase tracking-widest text-studio-muted mb-2">{t.common.timeLabel}</div>
                  <div className="text-xs font-semibold text-studio-accent">{t.services.lakhovsky.time}</div>
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-widest text-studio-muted mb-2">Формат</div>
                  <div className="text-xs font-semibold text-studio-accent capitalize">{t.services.lakhovsky.format}</div>
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-widest text-studio-muted mb-2">Ощущение</div>
                  <div className="text-xs font-semibold text-studio-accent capitalize">{t.services.lakhovsky.feeling}</div>
                </div>
              </div>

              <div className="space-y-4">
                <Button 
                  variant="secondary" 
                  href={WHATSAPP_LINK} 
                  target="_blank"
                  onClick={() => trackEvent('click_service_lakhovsky')}
                >
                  {t.services.lakhovsky.cta}
                </Button>
                <p className="text-[9px] text-studio-muted opacity-60 uppercase tracking-wider">{t.services.lakhovsky.disclaimer}</p>
              </div>
            </div>
            <div className="order-1 md:order-2 rounded-[60px] overflow-hidden aspect-[4/3] bg-studio-ink/10 shadow-lg relative group flex items-center justify-center">
              <LakhovskyImage t={t} />
            </div>
          </div>
        </div>
      </section>

      {/* 9. Главный комплекс: «Перезагрузка тела за один визит» */}
      <section className="py-24 bg-studio-ink text-white">
        <div className="studio-container">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <span className="text-studio-accent text-[11px] uppercase tracking-[0.4em] font-bold mb-6 block">{t.recharge.badge}</span>
              <h2 className="text-5xl md:text-7xl font-light mb-8">{t.recharge.title}</h2>
              <p className="text-xl text-white/70 font-light leading-relaxed mb-12">
                Сначала мягкий <span className="text-white font-medium underline underline-offset-8 font-serif italic text-lg">{t.services.steam.title}</span> помогает телу расслабиться и согреться. Затем <span className="text-white font-medium underline underline-offset-8 font-serif italic text-lg">{t.services.sinus.title}</span> добавляет плавное движение, чтобы вернуть ощущение лёгкости.
              </p>
              
              <div className="grid grid-cols-3 gap-6 mb-12">
                <div className="space-y-1">
                  <div className="text-[9px] uppercase tracking-widest opacity-50">{t.recharge.activeTimeLabel}</div>
                  <div className="text-2xl font-serif italic text-studio-accent">{t.recharge.activeTimeValue}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[9px] uppercase tracking-widest opacity-50">{t.recharge.fullVisitLabel}</div>
                  <div className="text-2xl font-serif italic text-studio-accent">{t.recharge.fullVisitValue}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[9px] uppercase tracking-widest opacity-50">Наш Формат</div>
                  <div className="text-xs font-semibold text-studio-accent uppercase tracking-wider">Пар + Синусоида</div>
                </div>
              </div>

              <div className="space-y-4">
                <Button 
                  href={WHATSAPP_LINK} 
                  target="_blank"
                  onClick={() => trackEvent('click_complex')}
                  className="w-full sm:w-auto !bg-studio-accent hover:!bg-white hover:text-studio-ink"
                >
                  {t.recharge.cta}
                </Button>
                <p className="text-[9px] opacity-40 uppercase tracking-widest">{t.common.nonMedical}</p>
              </div>
            </div>
            <div className="relative">
               <div className="aspect-square rounded-[60px] overflow-hidden">
                 <img 
                  src="https://images.unsplash.com/photo-1591343395902-1adcb454c7e7?q=80&w=2574&auto=format&fit=crop" 
                  alt="" 
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

      {/* 10. Кому подходит */}
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

      {/* 11. Как проходит первый визит */}
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

      {/* 12. Форматы посещения / цены */}
      <section id="pricing" className="py-32 bg-white">
        <div className="studio-container">
          <SectionHeading badge={t.pricing.badge} title={t.pricing.title} subtitle={t.pricing.subtitle} />
          
          <div className="grid md:grid-cols-3 gap-8 items-stretch mb-12">
            {t.pricing.items.map((item, i) => (
              <div key={i} className={`p-10 rounded-[40px] border flex flex-col justify-between transition-all duration-500 hover:shadow-xl ${
                item.popular ? "bg-studio-ink text-white border-studio-ink scale-105 shadow-2xl relative overflow-hidden" : "bg-studio-card border-studio-line"
              }`}>
                {item.badge && (
                  <span className="absolute top-6 right-6 px-3 py-1 bg-studio-accent text-white text-[9px] uppercase tracking-widest font-bold rounded-full">
                    {item.badge}
                  </span>
                )}
                <div>
                  <div className="text-[10px] uppercase tracking-widest opacity-50 mb-4">{item.title}</div>
                  <div className="space-y-1 mb-6">
                    <div className="text-4xl font-serif italic">{item.price} <span className="text-xs uppercase tracking-widest opacity-50">{item.optionLabel}</span></div>
                    <div className="text-2xl font-serif italic opacity-80">{item.priceOption} <span className="text-[10px] uppercase tracking-widest opacity-40">{item.optionLabelTwo}</span></div>
                  </div>
                  <p className={`text-sm mb-6 font-medium ${item.popular ? "text-white/90" : "text-studio-ink/95"}`}>{item.desc}</p>
                  <p className={`text-xs mb-8 italic leading-relaxed ${item.popular ? "text-white/60" : "text-studio-muted"}`}>{item.details}</p>
                  
                  {item.benefit && (
                    <div className={`p-4 rounded-2xl text-xs mb-8 ${item.popular ? "bg-white/10 text-studio-accent" : "bg-white border border-studio-line text-studio-ink font-semibold"}`}>
                      {item.benefit}
                    </div>
                  )}
                </div>
                <Button 
                  href={WHATSAPP_LINK}
                  target="_blank"
                  onClick={() => trackEvent(`click_pricing_${i}`)}
                  variant={item.popular ? "outline" : "secondary"}
                  className={`w-full !px-4 ${item.popular ? "!border-white !text-white hover:!bg-white hover:!text-studio-ink" : ""}`}
                >
                  {item.cta}
                </Button>
              </div>
            ))}
          </div>

          <p className="text-center text-xs italic text-studio-muted mb-16 max-w-2xl mx-auto">
            {t.pricing.subtext}
          </p>

          {/* 12.1 Интерактивный Калькулятор визита */}
          <div className="my-24 p-8 md:p-12 bg-studio-bg border border-studio-line rounded-[40px] max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block text-[10px] uppercase tracking-[0.4em] text-studio-accent font-bold mb-4">
                {t.calculator.badge}
              </span>
              <h3 className="text-3xl md:text-5xl font-light mb-4 leading-tight">{t.calculator.title}</h3>
              <p className="max-w-2xl mx-auto text-studio-muted text-sm font-light leading-relaxed">
                {t.calculator.subtitle}
              </p>
            </div>

            <div className="grid md:grid-cols-5 gap-8 items-stretch">
              {/* Левая колонка: Опции выбора */}
              <div className="md:col-span-3 space-y-4">
                {[
                  { id: 'steam_sinus', icon: Waves },
                  { id: 'massage', icon: Hand },
                  { id: 'lakhovsky', icon: Zap }
                ].map((item) => {
                  const isSelected = calcServices[item.id];
                  const title = t.calculator.services[item.id as keyof typeof t.calculator.services];
                  const priceTime = t.calculator.servicePrices[item.id as keyof typeof t.calculator.servicePrices];
                  
                  return (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setCalcServices(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                      className={`p-6 rounded-3xl border-2 transition-all duration-300 cursor-pointer flex items-center justify-between group ${
                        isSelected 
                          ? 'bg-white border-studio-accent shadow-md' 
                          : 'bg-white/50 border-studio-line hover:border-studio-accent/40'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                          isSelected ? 'bg-studio-accent text-white' : 'bg-studio-bg text-studio-muted group-hover:text-studio-accent'
                        }`}>
                          <item.icon size={20} />
                        </div>
                        <div>
                          <div className={`font-semibold text-sm transition-colors ${isSelected ? 'text-studio-ink' : 'text-studio-ink/80'}`}>{title}</div>
                          <div className="text-xs text-studio-muted mt-1 font-mono">{priceTime}</div>
                        </div>
                      </div>
                      
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected ? 'border-studio-accent bg-studio-accent text-white scale-110' : 'border-studio-line'
                      }`}>
                        {isSelected && <svg className="w-3.5 h-3.5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Правая колонка: Итоговый расчет */}
              <div className="md:col-span-2 bg-studio-ink text-white p-8 rounded-3xl border border-white/5 shadow-2xl flex flex-col justify-between min-h-[320px]">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-white/50 mb-6 font-bold">{t.calculator.badge}</div>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-white/40 mb-2 flex items-center gap-1.5">
                        <Clock size={12} />
                        {t.calculator.duration}
                      </div>
                      <div className="text-3xl font-serif italic text-studio-accent">
                        {totalCalcTime} <span className="text-xs uppercase tracking-widest text-white/60 font-sans font-normal">{t.calculator.timeSuffix}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10">
                      <div className="text-[10px] uppercase tracking-widest text-white/40 mb-2">
                        {t.calculator.totalPrice}
                      </div>
                      <div className="text-4xl font-serif italic text-white">
                        {totalCalcPrice.toLocaleString()} <span className="text-lg font-sans font-normal text-white/80">₽</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  {totalCalcPrice > 0 ? (
                    <Button
                      onClick={handleSendCalculatorToWhatsApp}
                      className="w-full !bg-studio-accent hover:!bg-white hover:text-studio-ink !py-4 shadow-xl"
                    >
                      <Send size={14} />
                      {t.calculator.sendWsp}
                    </Button>
                  ) : (
                    <div className="p-4 bg-white/5 rounded-2xl text-center text-xs text-white/60 italic">
                      {t.calculator.minSelect}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Аппаратная диагностика */}
          <div className="mb-16 p-8 md:p-12 bg-studio-card border border-studio-line rounded-[40px] max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-16 h-16 rounded-2xl bg-studio-accent/10 flex items-center justify-center shrink-0 text-studio-accent">
                <Sparkles size={28} />
              </div>
              <div>
                <h4 className="text-xl font-serif italic mb-3">{t.pricing.diagnostic.title}</h4>
                <p className="text-studio-muted text-sm leading-relaxed mb-4">{t.pricing.diagnostic.text}</p>
                <p className="text-[9px] text-studio-muted opacity-50 uppercase tracking-widest max-w-2xl">{t.pricing.diagnostic.disclaimer}</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {/* Карточка: Осциллятор Лаховского */}
            <div className="p-10 bg-studio-card border border-studio-line rounded-[40px] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-studio-accent/10 flex items-center justify-center text-studio-accent mb-6">
                  <Zap size={24} />
                </div>
                <h3 className="text-2xl font-serif italic mb-4">{t.pricing.lakhovsky.title}</h3>
                <p className="text-3xl font-serif italic text-studio-accent mb-6">{t.pricing.lakhovsky.price}</p>
                <p className="text-studio-muted text-sm leading-relaxed mb-10">{t.pricing.lakhovsky.desc}</p>
              </div>
              <Button 
                href={WHATSAPP_LINK} 
                target="_blank"
                onClick={() => trackEvent('click_pricing_lakhovsky')}
                variant="outline"
                className="w-full"
              >
                {t.pricing.lakhovsky.cta}
              </Button>
            </div>

            {/* Подарочный сертификат */}
            <div className="p-10 bg-studio-card border border-studio-line rounded-[40px] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-studio-accent/10 flex items-center justify-center text-studio-accent mb-6">
                  <Gift size={24} />
                </div>
                <h3 className="text-2xl font-serif italic mb-4">{t.pricing.certificate.title}</h3>
                <p className="text-3xl font-serif italic text-studio-accent mb-6">{t.pricing.certificate.price}</p>
                <p className="text-studio-muted text-sm leading-relaxed mb-10">{t.pricing.certificate.text}</p>
              </div>
              <Button 
                href={WHATSAPP_LINK} 
                target="_blank"
                onClick={() => trackEvent('click_certificate')}
                variant="outline"
                className="w-full"
              >
                {t.pricing.certificate.cta}
              </Button>
            </div>

            {/* 13. Корпоративный блок */}
            <div className="p-10 bg-studio-accent rounded-[40px] text-white flex flex-col justify-between overflow-hidden relative">
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center text-white mb-6">
                  <Heart size={24} className="fill-white" />
                </div>
                <h3 className="text-2xl font-light mb-4">{t.pricing.corporate.title}</h3>
                <p className="text-white/80 text-sm leading-relaxed mb-10">{t.pricing.corporate.text}</p>
              </div>
              <Button 
                href={WHATSAPP_LINK} 
                target="_blank" 
                onClick={() => trackEvent('click_corporate')}
                className="!bg-white !text-studio-accent w-full"
              >
                {t.pricing.corporate.cta}
              </Button>
            </div>
          </div>

        </div>
      </section>

      {/* 14. Важная рамка / дисклеймер */}
      <section className="py-24 bg-studio-bg border-y border-studio-line">
        <div className="studio-container">
          <div className="max-w-4xl mx-auto p-12 bg-white rounded-[60px] border border-studio-line flex flex-col md:flex-row gap-12 items-center">
             <div className="w-20 h-20 rounded-full bg-studio-accent/10 flex items-center justify-center shrink-0">
               <ShieldCheck size={40} className="text-studio-accent" />
             </div>
             <div>
               <h4 className="text-3xl font-serif italic mb-4">{t.importantFrame.title}</h4>
               <p className="text-studio-muted leading-relaxed italic">
                 {t.importantFrame.text}
               </p>
             </div>
          </div>
        </div>
      </section>

      {/* 15. Отзывы */}
      <section id="reviews" className="py-32 bg-white border-b border-studio-line">
        <div className="studio-container">
          <SectionHeading badge={t.reviews.badge} title={t.reviews.title} />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {t.reviews.items.map((review, i) => (
              <div key={i} className="p-10 bg-studio-card border border-studio-line rounded-[40px] flex flex-col justify-between">
                <div>
                   <div className="flex gap-1 mb-6">
                     {[...Array(5)].map((_, idx) => (
                       <Heart key={idx} size={14} className="fill-studio-accent text-studio-accent" />
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

      {/* 16. FAQ */}
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
                <div className="pt-6 text-studio-muted leading-relaxed text-sm font-light">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 17. Контакты */}
      <section id="contacts" className="py-32 bg-studio-bg overflow-hidden border-t border-studio-line">
        <div className="studio-container">
          <div className="grid lg:grid-cols-2 gap-32">
            <div>
              <SectionHeading badge={t.contacts.badge} title={t.contacts.title} />
              
              <div className="space-y-12">
                <div className="flex gap-8">
                  <MapPin className="text-studio-accent/80 shrink-0" size={32} />
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-studio-muted mb-2">{t.contacts.addressLabel}</div>
                    <div className="text-2xl font-serif italic text-studio-ink">{t.contacts.addressValue}</div>
                    <p className="mt-2 text-studio-muted italic font-light text-xs">{t.contacts.parkingNote}</p>
                  </div>
                </div>

                <div className="flex gap-8">
                  <Clock className="text-studio-accent/80 shrink-0" size={32} />
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-studio-muted mb-2">{t.contacts.hoursLabel}</div>
                    <div className="text-2xl font-serif italic text-studio-ink">{t.contacts.hoursValue}</div>
                    <p className="mt-2 text-studio-muted italic font-light text-xs">{t.contacts.bookingNote}</p>
                  </div>
                </div>

                <div className="flex gap-8">
                  <MessageSquare className="text-studio-accent/80 shrink-0" size={32} />
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-studio-muted mb-4">{t.contacts.phoneLabel} / Мессенджеры для записи</div>
                    <a 
                      href="tel:+79172343434" 
                      onClick={() => trackEvent('click_phone_call')}
                      className="text-3xl font-serif italic block hover:text-studio-accent transition-colors mb-6"
                    >
                      +7 (917) 234-34-34
                    </a>
                    
                    {/* Кнопки вызова мессенджеров */}
                    <div className="grid grid-cols-2 gap-4">
                      <a 
                        href={WHATSAPP_LINK} 
                        target="_blank" 
                        onClick={() => trackEvent('click_whatsapp_contacts')}
                        className="p-4 bg-white hover:bg-studio-accent hover:text-white transition-all text-center rounded-2xl border border-studio-line shadow-sm uppercase font-sans tracking-widest text-[9px] font-bold block"
                      >
                        WhatsApp
                      </a>
                      <a 
                        href={TELEGRAM_LINK} 
                        target="_blank" 
                        onClick={() => trackEvent('click_telegram_contacts')}
                        className="p-4 bg-white hover:bg-studio-accent hover:text-white transition-all text-center rounded-2xl border border-studio-line shadow-sm uppercase font-sans tracking-widest text-[9px] font-bold block"
                      >
                        Telegram
                      </a>
                      <a 
                        href={VK_LINK} 
                        target="_blank" 
                        onClick={() => trackEvent('click_vk_contacts')}
                        className="p-4 bg-white hover:bg-studio-accent hover:text-white transition-all text-center rounded-2xl border border-studio-line shadow-sm uppercase font-sans tracking-widest text-[9px] font-bold block"
                      >
                        VKontakte
                      </a>
                      <a 
                        href={MAKS_LINK} 
                        target="_blank" 
                        onClick={() => trackEvent('click_maks_contacts')}
                        className="p-4 bg-white hover:bg-studio-accent hover:text-white transition-all text-center rounded-2xl border border-studio-line shadow-sm uppercase font-sans tracking-widest text-[9px] font-bold block"
                      >
                        Maks ассистент
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group grayscale-[60%] hover:grayscale-0 transition-all duration-700">
              <div className="aspect-[4/5] bg-studio-ink/10 rounded-[60px] overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2670&auto=format&fit=crop" 
                  alt="" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute inset-0 bg-studio-ink/20 group-hover:bg-transparent transition-all"></div>
              <Button 
                href={MAP_LINK} 
                target="_blank" 
                onClick={() => trackEvent('click_route')}
                className="absolute bottom-10 right-10 !bg-white !text-studio-ink shadow-2xl flex items-center gap-2"
              >
                {t.contacts.routeCta} <ExternalLink size={14} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 18. Footer */}
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

      {/* 19. Плавающий ИИ-ассистент */}
      <div className="fixed bottom-8 right-8 z-[60]">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            trackEvent('click_ai_helper');
            setIsAiOpen(!isAiOpen);
          }}
          className="w-16 h-16 rounded-full bg-studio-accent text-white shadow-2xl flex items-center justify-center hover:bg-studio-ink transition-colors relative cursor-pointer"
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
                <button className="cursor-pointer" onClick={() => setIsAiOpen(false)}><X size={20} /></button>
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
                        ? 'bg-white rounded-tl-none font-light italic text-studio-ink/90' 
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
                        onClick={() => {
                          trackEvent(`click_ai_chip_${chip}`);
                          handleSendMessage(chip);
                        }}
                        className="px-4 py-2 bg-white border border-studio-line rounded-full text-[10px] uppercase tracking-widest hover:border-studio-accent transition-colors shadow-sm font-bold cursor-pointer"
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
                    className="flex-1 bg-studio-bg border-none rounded-full px-5 py-3 text-sm focus:ring-1 focus:ring-studio-accent font-light text-studio-ink outline-none"
                    disabled={isTyping}
                  />
                  <button 
                    type="submit"
                    disabled={isTyping || !inputValue.trim()}
                    className="w-11 h-11 rounded-full bg-studio-accent text-white flex items-center justify-center disabled:opacity-50 disabled:grayscale transition-all cursor-pointer shrink-0"
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
