# Digitální Identita - Restaurace Na Kopečku

Tento repozitář obsahuje webovou prezentaci a administrační systém pro asijskou fusion restauraci **Na Kopečku** v Ústí nad Labem. Projekt se skládá z moderní klientské části (frontend) a zabezpečeného administračního panelu s napojením na Supabase (databáze, autentizace a úložiště).

## ✨ Hlavní funkce aplikace

### Veřejná část (Frontend)
- **Moderní design:** Tmavý režim (Dark mode) s luxusními vizuály, interaktivními hover efekty, "glassmorphism" prvky a vlastním designovým kurzorem.
- **Dynamické menu:** Automatické načítání položek jídelního lístku přímo z databáze s bezproblémovým zobrazením a možností nastavení viditelnosti jednotlivých položek. Obsahuje integrovaný fallback na demoverzi v případě výpadku připojení.
- **Informační pop-upy:** Možnost zobrazit návštěvníkům webu různé novinky či upozornění (např. o nové nabídce či speciálních eventech) zobrazením banneru na hlavní straně.
- **Otevírací doba:** Dynamicky spravovaná otevírací doba chytře seskupená do bloků, s automatickým zvýrazněním aktuálního dne.

### Administrace (Admin Dashboard)
- **Zabezpečený přístup:** Neautorizovaní uživatelé nemají přístup ke správě, k autentizaci slouží zabezpečené přihlášení.
- **Správa menu:** Jednoduché přidávání, úprava (názvy, popisky, ceny), skrývání a definitivní smazání položek přímo v přehledném editoru.
- **Správa fotografií:** Přímý upload obrázků pokrmů do cloudu s integrovanou automatickou konverzí formátů z mobilních zařízení Apple (z `.heic` do webově kompatibilního `.jpg`).
- **Nastavení podniku:** Pohodlné nastavování pop-up sdělení a otevírací doby (včetně označení zavřených dnů).
- **Ochrana neuložených dat:** Upozornění na neuloženou práci při modifikaci obsahu (ochrana proti opuštění stránky bez uložení).

## 🛠 Technologie & Stack

Projekt je postaven s důrazem na moderní frontendové postupy bez potřeby vlastního backendového serveru.

- **DUI & Framework:** React (verze 19) + Vite
- **Stylování:** Tailwind CSS 4 (+ vlastní animace a efekty v `index.css`)
- **Routing:** React Router v7 (`/`, `/login`, `/admin`)
- **BaaS (Backend jako Služba):** Supabase (poskytuje PostgreSQL databázi, Row Level Security politiky, Auth pro přihlašování a Storage pro obrázky pokrmů)
- **Deployment:** Aplikace je plně kontejnerizována pomocí Dockeru (`dockerfile`) a má zajištěnou podporu pro jednoduché nasazení na Vercel (`vercel.json`).

## 📂 Struktura repozitáře

- `/restaurace_na_kopecku` - Výchozí aplikační adresář (Vite projekt)
  - `src/` - Zdrojové React kódy (`App.jsx` hlavní aplikace s routováním `main.jsx`, dashboard `AdminPage.jsx`)
  - `src/Components/` - Znovupoužitelné dílčí UI struktury (Navigace, Footer, Mapy)
  - `db_setup.sql` & `seed_data.sql` - SQL skripty pro přípravu a osazení Supabase databáze (obsahují zakládání tabulek, definice přístupových politik a vzorová data).
  - `package.json` a konfigurace pro ESLint či Vite.
- `/fotky a videa` - Materiály z produkce videa (obsahuje zdrojové soubory Adobe Premiere Pro a After Effects a také finální promo videa např. `PromoVideoV1mp4`).
- `/Images` - Grafické materiály a vyexportované fotky z PSD.
- `/PSD` - Zdrojové Photoshop (.psd) soubory pro tvorbu grafiky ve složce Images.
- `/.AF` - Zdrojové projektové soubory z Affinity (z nichž jsou exportovány PDF dokumenty).
- `/PDF` - Projektová dokumentace a finální PDF exporty ze složky `.AF`. Konkrétně `digitalni_identita.pdf` je technická/projektová dokumentace a `restauracenakopeckukomplet.pdf` slouží jako marketingový a brandingový manuál.
- `/README.md` - Tento soubor s přehledem.

## 🚀 Jak spustit projekt lokálně

### 1. Podmínky pro běh projekt
Mějte nainstalovaný **Node.js**

### 2. Instalace závislostí
Přesuňte se do adresáře aplikace a spusťte instalaci balíčků:

```bash
cd restaurace_na_kopecku
npm install
```

### 3. Nastavení .env proměnných (propojení se Supabase)
Aby aplikace správně načítala a spravovala data, je nutné vytvořit soubor `.env` uvnitř složky `restaurace_na_kopecku` s konfigurací Supabase:

```env
VITE_SUPABASE_URL=vase_supabase_url
VITE_SUPABASE_ANON_KEY=vas_supabase_anon_key
```

*Poznámka: Pro naplnění a konfiguraci Supabase projektu využijte přiložené soubory `db_setup.sql` a `seed_data.sql` v SQL editoru Supabase. Dále bude nutné založit kbelík (bucket) s názvem `menu-images` ve Storage sekci pro nahrávání obrázků z administrace.*

### 4. Spuštění vývojového serveru
Spustí lokální dev server pomocí nástroje Vite.

```bash
npm run dev
```
Aplikace poběží lokálně (přednastaveno na `http://localhost:5173`).


### Zabalení a Docker kontejner

Sestavit image a případně ho spustit v Dockeru provedete pomocí:
```bash
docker build -t restaurace-na-kopecku .
docker run -p 80:80 restaurace-na-kopecku
```

