import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-black text-white pt-20 pb-10 border-t border-white/10">
            <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-12">

                {/* Brand */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <img src="/logo.png" alt="Logo" className="h-10 w-auto opacity-90" />
                        <span className="text-xl font-serif font-bold text-accent">Na Kopečku</span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                        Zažijte výjimečnou atmosféru a gastronomii v srdci přírody. Vaříme s vášní z lokálních surovin.
                    </p>
                </div>

                {/* Contact */}
                <div>
                    <h3 className="text-xl font-serif text-white mb-6">Kontakt</h3>
                    <ul className="space-y-4 text-gray-300 text-sm">
                        <li className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            <span>Restaurace na Kopečku 123<br />123 45, Horní Dolní</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            <a href="tel:+420123456789" className="hover:text-accent transition">+420 123 456 789</a>
                        </li>
                        <li className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            <a href="mailto:info@nakopecku.cz" className="hover:text-accent transition">info@nakopecku.cz</a>
                        </li>
                    </ul>
                </div>

                {/* Opening Hours */}
                <div>
                    <h3 className="text-xl font-serif text-white mb-6">Otevírací doba</h3>
                    <ul className="space-y-2 text-gray-300 text-sm">
                        <li className="flex justify-between border-b border-white/5 pb-2">
                            <span>Pondělí - Čtvrtek</span>
                            <span>11:00 - 22:00</span>
                        </li>
                        <li className="flex justify-between border-b border-white/5 pb-2">
                            <span>Pátek - Sobota</span>
                            <span>11:00 - 23:00</span>
                        </li>
                        <li className="flex justify-between pb-2">
                            <span>Neděle</span>
                            <span>11:00 - 21:00</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="container mx-auto px-6 mt-16 pt-8 border-t border-white/5 text-center text-gray-600 text-xs">
                &copy; {new Date().getFullYear()} Restaurace na Kopečku. Všechna práva vyhrazena.
            </div>
        </footer>
    );
};

export default Footer;
