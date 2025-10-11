import React, { useEffect, useState } from "react";

const links = [
  { href: "#domu", label: "Domů" },
  { href: "#menu", label: "Menu" },
  { href: "#rezervace", label: "Rezervace" },
  { href: "#kontakt", label: "Kontakt" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navBase = "fixed top-0 inset-x-0 z-50 transition-all duration-300";
  const navStyle = scrolled
    ? "backdrop-blur bg-neutral-100/90 border-b border-neutral-300 shadow-sm"
    : "bg-neutral-50/70 border-b border-transparent";

  const linkBase =
    "px-1 py-0.5 text-neutral-800 hover:text-black transition-colors duration-200 underline-offset-4 hover:underline";

  return (
    <nav className={`${navBase} ${navStyle}`}>
      <div className="mx-auto max-w-screen-2xl h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo / name */}
        <a href="#domu" className="text-lg font-semibold tracking-wide text-black">
          Restaurace na Kopečku
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8 text-sm font-medium">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className={linkBase}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Hamburger (mobile) */}
        <button
          className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-lg ring-1 ring-neutral-400 hover:bg-neutral-200/70 transition-colors"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Otevřít menu</span>
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {open ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile panel */}
      {open && (
        <div className="md:hidden border-t border-neutral-300 bg-neutral-50/95 backdrop-blur-sm">
          <ul className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-2 grid gap-2 text-base">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="block py-2 text-neutral-800 hover:text-black transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
