import { useEffect, useRef, useState } from 'react';
import Navbar from "./Components/UI/Navbar.jsx";
import Footer from "./Components/UI/Footer.jsx";
import MapEmbed from "./Components/MapEmbed.jsx";
import Mojito from './assets/MojitoRestauraceNaKopecku.jpg';
import Sal from './assets/SalRestauraceNaKopecku.jpg';
import { supabase } from './supabaseClient.js';
import { groupOpeningHours } from './utils/openingHours.js';

const FALLBACK_MENU = [
  {
    name: "Orange Chicken",
    description: "Křupavé kousky kuřete v sladkokyselé pomerančové omáčce, jasmínová rýže.",
    price: 269,
    image_url: "https://media.istockphoto.com/id/492023021/photo/chinese-orange-chicken-with-chopsticks.jpg?s=612x612&w=0&k=20&c=lerAHdsLQh0OghzMt7n_fKER2y2enB1Djnss_Wpaj6s="
  },
  {
    name: "Bun Bo Nam Bo",
    description: "Vietnamský nudlový salát s hovězím masem, bylinkami a arašídy.",
    price: 289,
    image_url: "https://images.unsplash.com/photo-1503764654157-72d979d9af2f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Pho Bo",
    description: "Tradiční silný hovězí vývar, rýžové nudle, plátky masa, čerstvé bylinky.",
    price: 279,
    image_url: "https://media.istockphoto.com/id/1462352351/photo/pho.jpg?s=612x612&w=0&k=20&c=TaNeUcQyazuboL2g6sC_EMzuF9ZvW9xPvDL6FZgWKVM="
  },
  {
    name: "Bun Cha",
    description: "Grilované vepřové s rýžovými nudlemi a čerstvými bylinkami ve sladkokyselé zálivce.",
    price: 289,
    image_url: "https://media.istockphoto.com/id/888740900/photo/bun-cha-or-vietnamese-cold-white-rice-noodles-served-with-grilled-pork-and-a-variety-of-herbs.jpg?s=612x612&w=0&k=20&c=-2lPw2IeUNnNtFSKcg5YVo0GOYMPy4_G7cxj2UrtdGM="
  },
  {
    name: "Com Tam",
    description: "Lámaná rýže s marinovanou krkovicí, vaječnou sedlinou a nakládanou zeleninou.",
    price: 279,
    image_url: "https://media.istockphoto.com/id/2049290538/photo/close-up-of-com-tam-or-vietnamese-broken-rice.jpg?s=612x612&w=0&k=20&c=8WEzQLJQI1aMinXEQ7kR-KmxvlLvTZGgcI53eYt2VU0="
  },
  {
    name: "Zavitky",
    description: "Mix čerstvých letních a smažených jarních závitků se sladkokyselou omáčkou.",
    price: 189,
    image_url: "https://cdn.administrace.tv/2022/08/07/hd/9ff4384829f45090a8b4d88bd594c984.jpg"
  }
];

const DEFAULT_HOURS = {
  monday: { open: null, close: null },
  tuesday: { open: '12:00', close: '22:00' },
  wednesday: { open: '12:00', close: '22:00' },
  thursday: { open: '12:00', close: '22:00' },
  friday: { open: '12:00', close: '23:00' },
  saturday: { open: '12:00', close: '23:00' },
  sunday: { open: '12:00', close: '20:00' },
};

function App() {
  const cursorDot = useRef(null);
  const cursorOutline = useRef(null);
  const [menuItems, setMenuItems] = useState(FALLBACK_MENU);
  const [openingHours, setOpeningHours] = useState(DEFAULT_HOURS);
  const [popup, setPopup] = useState(null);
  const [popupHidden, setPopupHidden] = useState(false);

  useEffect(() => {
    // Only run custom cursor logic on non-touch devices to prevent mobile issues
    if (window.matchMedia("(hover: hover)").matches) {
      const moveCursor = (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        if (cursorDot.current) {
          cursorDot.current.style.left = `${posX}px`;
          cursorDot.current.style.top = `${posY}px`;
        }
        if (cursorOutline.current) {
          cursorOutline.current.animate({
            left: `${posX}px`,
            top: `${posY}px`
          }, { duration: 500, fill: "forwards" });
        }
      };
      window.addEventListener("mousemove", moveCursor);
      return () => window.removeEventListener("mousemove", moveCursor);
    }
  }, []);

  useEffect(() => {
    if (!supabase) return

    const loadData = async () => {
      try {
        const [{ data: items }, { data: settings }] = await Promise.all([
          supabase.from('menu_items').select('*').eq('is_visible', true).order('id'),
          supabase.from('settings').select('*'),
        ]);

        if (items && items.length > 0) {
          const mapped = items.map((item) => ({
            name: item.name,
            description: item.description,
            price: item.price,
            image_url: item.image_url,
          }));
          setMenuItems(mapped);
        }

        if (settings && settings.length > 0) {
          const popupSetting = settings.find((s) => s.key === 'popup');
          const hoursSetting = settings.find((s) => s.key === 'opening_hours');

          if (popupSetting?.value?.active) {
            setPopup({
              title: popupSetting.value.title ?? '',
              message: popupSetting.value.message ?? '',
            });
            setPopupHidden(false);
          } else {
            setPopup(null);
          }

          if (hoursSetting?.value) {
            setOpeningHours({ ...DEFAULT_HOURS, ...hoursSetting.value });
          }
        }
      } catch {
        // tichý fallback na lokální data
      }
    };

    loadData();
  }, []);

  // Use the helper to group days dynamically based on current data
  const groupedHours = groupOpeningHours(openingHours);

  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-accent selection:text-white cursor-auto md:cursor-none">
      {/* Custom Cursor Elements - Hidden on touch devices via CSS media query usually, or JS check above */}
      <div ref={cursorDot} className="cursor-dot hidden md:block pointer-events-none"></div>
      <div ref={cursorOutline} className="cursor-outline hidden md:block pointer-events-none"></div>

      {/* Noise Overlay */}
      <div className="noise-overlay z-50"></div>

      {/* Popup / novinka */}
      {popup && !popupHidden && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 px-4">
          <div className="glass-panel px-6 py-4 border border-accent/40 max-w-md mx-auto text-center relative">
            <button
              type="button"
              aria-label="Zavřít"
              className="absolute top-2 right-2 text-xs text-gray-400 hover:text-white"
              onClick={() => setPopupHidden(true)}
            >
              ×
            </button>
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-2">
              Novinka
            </p>
            <h3 className="text-lg font-serif mb-2">{popup.title}</h3>
            <p className="text-sm text-gray-300">{popup.message}</p>
          </div>
        </div>
      )}

      <Navbar />

      {/* HERO SECTION */}
      <section id="domu" className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110 motion-safe:animate-pulse-slow origin-center" style={{ backgroundImage: `url(${Mojito})` }}>          <div className="absolute inset-0 bg-black/60 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-7xl mx-auto flex flex-col items-center gap-6 md:gap-10 pt-20">
          <div className="animate-fade-in-up flex flex-col items-center gap-4">
            <span className="w-[1px] h-12 md:h-20 bg-accent mb-2"></span>
            <span className="text-accent tracking-[0.4em] md:tracking-[0.6em] uppercase text-[10px] md:text-sm font-bold glow-sm">
              Est. 2024
            </span>
          </div>

          {/* Typography adjusted for Mobile (prevent overlap) */}
          <h1 className="text-5xl md:text-8xl lg:text-[9rem] font-serif text-white font-bold leading-tight md:leading-[0.85] tracking-tight drop-shadow-2xl animate-fade-in-up py-2" style={{ animationDelay: "0.2s" }}>
            Na <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-accent to-white italic">Kopečku</span>
          </h1>

          <p className="max-w-md md:max-w-xl text-gray-300 text-base md:text-2xl font-light leading-relaxed mt-2 md:mt-4 mb-2 drop-shadow-lg animate-fade-in-up px-4" style={{ animationDelay: "0.4s" }}>
            Symfonie chutí v srdci přírody.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 md:gap-8 animate-fade-in-up mt-6 md:mt-8 w-full justify-center px-6" style={{ animationDelay: "0.6s" }}>
            <a href="#menu" className="group relative px-8 py-4 md:px-12 overflow-hidden border border-white/30 hover:border-white transition-colors duration-500 w-full sm:w-auto">
              <div className="absolute inset-0 w-3 bg-white transition-all duration-[250ms] ease-out group-hover:w-full opacity-10"></div>
              <span className="relative text-white font-bold uppercase tracking-[0.2em] group-hover:text-white text-xs md:text-sm">Menu</span>
            </a>
            <a href="#rezervace" className="group relative px-8 py-4 md:px-12 overflow-hidden bg-accent border border-accent hover:border-orange-500 transition-colors duration-500 shadow-[0_0_40px_rgba(199,80,49,0.4)] hover:shadow-[0_0_60px_rgba(199,80,49,0.6)] w-full sm:w-auto">
              <span className="relative text-white font-bold uppercase tracking-[0.2em] text-xs md:text-sm group-hover:tracking-[0.3em] transition-all">Rezervace</span>
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce opacity-50 mix-blend-overlay hidden md:block">
          <span className="text-[10px] uppercase tracking-[0.3em] text-white rotate-90 block mb-12 origin-left">Scroll</span>
        </div>
      </section>

      {/* STORY SECTION */}
      <section className="py-24 md:py-40 bg-[#080808] relative overflow-hidden text-white">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 md:gap-24 items-center relative z-20">
          <div className="order-2 lg:order-1 relative group pl-0 md:pl-10">
            <div className="absolute -inset-10 bg-gradient-to-tr from-accent/20 to-transparent blur-3xl opacity-40"></div>
            <div className="relative z-10 transform md:-rotate-3 hover:rotate-0 transition-transform duration-1000 ease-in-out">
              <img src={Sal} alt="Chef" className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-1000 shadow-2xl object-cover rounded-sm" />
              <div className="hidden md:flex absolute -bottom-10 -right-10 w-32 h-32 md:w-40 md:h-40 bg-accent/10 backdrop-blur-md border border-white/10 items-center justify-center rounded-full">
                <span className="font-serif italic text-xl md:text-2xl text-accent">Passion</span>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <span className="text-accent font-bold tracking-[0.4em] uppercase text-xs mb-6 block">Filosofie</span>
            <h2 className="text-5xl md:text-8xl font-serif text-white mb-8 md:mb-10 leading-none">Umění <br /><span className="text-accent italic">Vaření</span></h2>
            <div className="space-y-6 md:space-y-8 text-base md:text-lg text-gray-400 font-light leading-relaxed">
              <p>
                Věříme, že jídlo je emoce. Každý talíř vypráví příběh o zemi, ze které pochází, o rukou, které ho vypěstovaly, a o ohni, který mu vdechl život.
              </p>
              <p className="text-white border-l-2 border-accent pl-6 italic">
                "Nejsme jen restaurace. Jsme destinace pro vaše smysly."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MENU SECTION */}
      <section id="menu" className="py-24 md:py-40 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a100d] to-black opacity-60"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center mb-20 md:mb-32 relative">
            {/* Background text adjusted z-index and size to prevents overlap */}
            {/* Background text - Outline Style to prevent overlap */}
            <h2 className="text-6xl md:text-[8rem] lg:text-[14rem] font-serif font-bold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none whitespace-nowrap z-0 opacity-10"
              style={{ WebkitTextStroke: '1px rgba(255, 255, 255, 0.3)', color: 'transparent' }}>
              MENU
            </h2>
            <h2 className="text-4xl md:text-7xl font-serif text-white mt-10 relative z-10 drop-shadow-2xl">Gastronomie</h2>
            <div className="w-1 h-12 md:h-20 bg-gradient-to-b from-accent to-transparent mt-8 relative z-10"></div>
          </div>

          {/* Image Grid Menu */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {menuItems.map((item, i) => (
              <div key={i} className="group relative h-[400px] overflow-hidden border border-white/10 rounded-sm cursor-none tilt-card">
                {/* Image Background */}
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" style={{ backgroundImage: `url(${item.image_url})` }}></div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-80"></div>

                {/* Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <h3 className="text-3xl font-serif text-white mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 font-bold">{item.name}</h3>
                  <div className="w-12 h-1 bg-accent mb-4 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  {item.description && (
                    <p className="text-gray-300 text-sm mb-6 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100 font-light leading-relaxed">
                      {item.description}
                    </p>
                  )}
                  {item.price != null && (
                    <span className="text-2xl text-accent font-bold">
                      {item.price}{' '}
                      <span className="text-sm font-normal text-white">CZK</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESERVATION SECTION */}
      <section id="rezervace" className="py-24 md:py-40 relative bg-[url('https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-fixed bg-center">
        <div className="absolute inset-0 bg-[#050505]/90"></div>
        <div className="container mx-auto px-6 relative z-10 flex flex-col items-center justify-center text-center">

          <div className="relative p-8 md:p-32 border-y border-white/10 w-full max-w-5xl bg-black/20 backdrop-blur-sm rounded-xl">
            <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#050505] px-6 text-accent uppercase tracking-widest text-xs whitespace-nowrap">Reservations Only</span>

            <h2 className="text-4xl md:text-8xl font-serif text-white mb-8 md:mb-12">Vaše Místo</h2>

            <p className="text-gray-400 text-base md:text-xl mb-12 md:mb-16 max-w-2xl mx-auto font-light leading-relaxed">
              Pro zajištění absolutní péče přijímáme rezervace výhradně telefonicky.
            </p>
            <div className="flex justify-center items-center w-full px-4">
              <a href="tel:+420775059591" className="group relative z-10 transition-transform duration-500 hover:scale-105 inline-block text-4xl md:text-8xl lg:text-9xl font-montserrat font-bold whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 group-hover:from-accent group-hover:to-orange-600 transition-all duration-500 md:cursor-none">
                +420 775 059 591

                <div className="mt-8 flex items-center justify-center gap-4 text-[10px] md:text-xs text-gray-500 uppercase tracking-[0.4em] group-hover:text-white transition-colors">
                  <span className="w-4 md:w-8 h-[1px] bg-accent"></span>
                  Zavolejte Nám
                  <span className="w-4 md:w-8 h-[1px] bg-accent"></span>
                </div>
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="kontakt" className="relative bg-black border-t border-white/5">
        <div className="grid lg:grid-cols-2 min-h-[600px] lg:min-h-[800px]">
          {/* Map Container */}
          {/* Map Container - Improved Styling */}
          <div className="w-full h-[400px] lg:h-auto relative z-0 group overflow-hidden">
            <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors duration-700 pointer-events-none z-10"></div>
            <div className="w-full h-full grayscale contrast-110 group-hover:grayscale-0 transition-all duration-1000">
              <MapEmbed />
            </div>
          </div>

          {/* Info Container */}
          <div className="flex flex-col justify-center p-10 md:p-12 lg:p-32 bg-[#080808]">
            <span className="text-accent font-bold tracking-[0.4em] uppercase text-xs mb-8 block">Kontakt</span>
            <h2 className="text-5xl md:text-6xl font-serif text-white mb-12">Navštivte nás
            </h2>

            <div className="grid gap-12 md:gap-16">
              {/* Adresa Section */}
              <div className="group">
                <h4 className="text-accent uppercase tracking-[0.2em] text-sm mb-4 font-bold">
                  Adresa
                </h4>
                <p className="text-xl md:text-2xl text-white font-semibold group-hover:text-accent transition-colors duration-300 leading-relaxed">
                  Kočkovská 2579, <br />
                  400 11 Ústí nad Labem-Severní Terasa
                </p>
              </div>
              <div className="group font-montserrat">
                <h4 className="text-accent uppercase tracking-[0.2em] text-sm mb-6 font-bold">
                  Otevírací Doba
                </h4>
                <ul className="text-base md:text-lg text-white/80 space-y-4 font-semibold max-w-sm">
                  {groupedHours.map((group, index) => (
                    <li
                      key={index}
                      className={`flex justify-between border-b border-white/10 pb-2
                        ${group.isClosed ? 'text-white/40 text-sm' : ''}
                        ${group.isToday && !group.isClosed ? 'text-accent font-bold' : ''}`}
                    >
                      <span className={group.isToday && !group.isClosed ? 'text-accent' : (group.isClosed ? 'text-white/50' : '')}>
                        {group.label}
                      </span>
                      <span className="uppercase tracking-wider">{group.time}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="group">
                <h4 className="text-gray-600 uppercase tracking-widest text-xs mb-4">Napište Nám</h4>
                <a href="mailto:Eva.96.le@gmail.com" className="text-xl text-white hover:text-accent transition-colors border-b border-white/20 pb-1 break-all">Eva.96.le@gmail.com</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer openingHours={openingHours} />
    </div>
  );
}

export default App;
