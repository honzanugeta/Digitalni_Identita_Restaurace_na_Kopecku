import React, { useEffect, useState } from "react";

const links = [
  { href: "#domu", label: "Úvod" },
  { href: "#menu", label: "Menu" },
  { href: "#rezervace", label: "Rezervace" },
  { href: "#kontakt", label: "Kontakt" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Premium transition styles
  const navClasses = scrolled
    ? "glass-nav py-3"
    : "bg-transparent py-5";

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ease-in-out ${navClasses}`}>
      <div className="mx-auto max-w-screen-2xl px-6 lg:px-12 flex items-center justify-between">
        {/* Logo Area */}
        <a href="#domu" className="flex items-center gap-3 group">
          <img src="/logo.png" alt="Logo" className="h-12 w-auto object-contain transition-transform duration-500 group-hover:scale-105" />
          <div className="flex flex-col">
            <span className="text-xl md:text-2xl font-serif text-white tracking-wider font-bold">Na Kopečku</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-accent">Restaurace</span>
          </div>
        </a>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="text-sm uppercase tracking-widest text-gray-300 hover:text-accent transition-colors duration-300 font-medium relative group">
                {l.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent transition-all duration-300 group-hover:w-full"></span>
              </a>
            </li>
          ))}
          {/* CTA Button in Navbar */}
          <li>
            <a href="#rezervace" className="px-5 py-2 border border-accent text-accent text-xs uppercase tracking-widest hover:bg-accent hover:text-white transition-all duration-300">
              Rezervovat Stůl
            </a>
          </li>
        </ul>

        {/* Hamburger (Mobile) */}
        <button
          className="md:hidden text-white p-2 hover:text-accent transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-black/95 backdrop-blur-xl z-40 transition-transform duration-500 md:hidden flex flex-col items-center justify-center gap-8 ${open ? "translate-x-0" : "translate-x-full"}`}>
        <button className="absolute top-6 right-6 text-gray-400 hover:text-white" onClick={() => setOpen(false)}>
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            className="text-3xl font-serif text-white hover:text-accent transition-colors"
          >
            {l.label}
          </a>
        ))}
        <a href="#rezervace" onClick={() => setOpen(false)} className="mt-8 px-8 py-3 border border-accent text-accent uppercase tracking-widest hover:bg-accent hover:text-white transition-all">
          Rezervace
        </a>
      </div>
    </nav>
  );
}
