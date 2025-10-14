import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from "./Components/UI/Navbar.jsx";
import MapEmbed from "./Components/MapEmbed.jsx";

function App() {
  const [count, setCount] = useState(0)

  return (
    <> 
       <div className="min-h-dvh">
      <Navbar />

      {/* Každé sekci dej scroll-mt odpovídající výšce navbaru */}
      <section id="domu" className="scroll-mt-20 container mx-auto px-4 py-16 text-black">
        <h1 className="text-3xl font-bold mb-4 text-black">Video here</h1>
        <p>Úvodní obsah…</p>
        
      </section>

      <section id="menu" className="scroll-mt-24 container mx-auto px-4 py-16 text-black">
        <h2 className="text-2xl font-semibold mb-4 text-black ">Menu</h2>
        <p>Naše nabídka…</p>
      </section>

      <section id="rezervace" className="scroll-mt-20 container mx-auto px-4 py-16 text-black">
        <h2 className="text-2xl font-semibold mb-4 text-black">Rezervace</h2>
        <p>Formulář / info…</p>
      </section>

      <section id="kontakt" className="scroll-mt-20 container mx-auto px-4 py-16 text-black">
        <h2 className="text-2xl font-semibold mb-4 text-black">Kontakt</h2>
        <MapEmbed />
        <p>Adresa, mapa, telefon…</p>
      </section>
    </div>
    </>
  )
}

export default App
