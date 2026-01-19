import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-black text-white pt-20 pb-10 border-t border-white/10">
            <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-12">

                {/* Brand */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        {/* Pokud máš logo v assets, nezapomeň ho importovat jako ty předchozí obrázky */}
                        <img src="/logo.png" alt="Logo" className="h-10 w-auto opacity-90" />
                        <span className="text-xl font-bold text-accent tracking-tight">Na Kopečku</span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-xs font-medium">
                        Zažijte výjimečnou atmosféru a gastronomii v srdci přírody. Vaříme s vášní z lokálních surovin.
                    </p>
                </div>

                {/* Kontakt */}
                <div>
                    <h3 className="text-sm uppercase tracking-[0.2em] font-bold text-accent mb-6">Kontakt</h3>
                    <ul className="space-y-4 text-gray-300 text-sm font-semibold">
                        <li className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            <span>
                                Kočkovská 2579,<br />
                                400 11 Ústí nad Labem-Severní Terasa
                            </span>
                        </li>
                        <li className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            <a href="tel:+420123456789" className="hover:text-accent transition">+420 775 059 591</a>
                        </li>
                        <li className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            <a href="mailto:Eva.96.le@gmail.com" className="hover:text-accent transition">Eva.96.le@gmail.com</a>
                        </li>
                    </ul>
                </div>

                {/* Opening Hours */}
                <div>
                    <h3 className="text-sm uppercase tracking-[0.2em] font-bold text-accent mb-6">Otevírací doba</h3>
                    <ul className="space-y-2 text-gray-300 text-sm font-semibold">
                        <li className="flex justify-between border-b border-white/5 pb-2">
                            <span className="opacity-50">Pondělí</span>
                            <span className="text-accent text-xs uppercase tracking-tighter">Zavřeno</span>
                        </li>
                        <li className="flex justify-between border-b border-white/5 pb-2">
                            <span>Úterý — Čtvrtek</span>
                            <span>12:00 — 22:00</span>
                        </li>
                        <li className="flex justify-between border-b border-white/5 pb-2 text-white">
                            <span>Pátek — Sobota</span>
                            <span className="font-bold">12:00 — 23:00</span>
                        </li>
                        <li className="flex justify-between pb-2">
                            <span>Neděle</span>
                            <span>12:00 — 20:00</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="container mx-auto px-6 mt-16 pt-8 border-t border-white/5 text-center text-gray-600 text-[10px] uppercase tracking-widest font-bold">
                &copy; {new Date().getFullYear()} Restaurace na Kopečku. <span className="text-white/20">Všechna práva vyhrazena.</span>
            </div>
        </footer>
    );
};

export default Footer;