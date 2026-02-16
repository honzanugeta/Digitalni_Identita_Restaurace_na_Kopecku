# Restaurace na Kopečku

Moderní webová stránka pro restauraci Na Kopečku - asijská fúze v Ústí nad Labem.

## Technologie

- **React 19** - Moderní React s nejnovějšími funkcemi
- **Vite** - Rychlý build tool a dev server
- **Tailwind CSS 4** - Utility-first CSS framework
- **Supabase** - Auth + databáze + nastavení
- **React Router** - Routing pro veřejný web a admin
- **ESLint** - Linting pro kvalitní kód

## Instalace

```bash
npm install
```

## Supabase nastavení

Vytvořte projekt v Supabase a v **SQL editoru** spusťte:

```sql
create table menu_items (
  id bigint generated always as identity primary key,
  name text not null,
  description text,
  price numeric(10,2),
  image_url text,
  is_visible boolean default true
);

create table settings (
  id bigint generated always as identity primary key,
  key text unique not null,
  value jsonb not null
);
```

V kořeni projektu vytvořte `.env` soubor:

```bash
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

V Supabase v sekci **Auth → Users** založte admin uživatele (email + heslo), kterým se přihlásíte do `/login`.

### Bezpečnost (RLS)

Pro produkční nasazení doporučujeme:

- Zapnout **Row Level Security (RLS)** pro tabulky `menu_items` a `settings`.
- Přidat politiky, které:
  - Povolit **SELECT** všem uživatelům (veřejné čtení menu a nastavení).
  - Povolit **INSERT/UPDATE/DELETE** pouze přihlášeným adminům (např. podle emailu / role).


## Vývoj

Spusťte vývojový server:

```bash
npm run dev
```

Aplikace bude dostupná na `http://localhost:5173`

## Build

Pro produkční build:

```bash
npm run build
```

Výstup bude v adresáři `dist/`.

## Preview produkčního buildu

```bash
npm run preview
```

## Linting

```bash
npm run lint
```

## Docker

Pro build Docker image:

```bash
docker build -t restaurace-na-kopecku .
```

Pro spuštění:

```bash
docker run -p 80:80 restaurace-na-kopecku
```

## Struktura projektu

```
src/
├── Components/
│   ├── UI/
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   └── MapEmbed.jsx
├── assets/
├── App.jsx
├── main.jsx
└── index.css
```

## Kontakt

- **Telefon:** +420 775 059 591
- **Email:** Eva.96.le@gmail.com
- **Adresa:** Kočkovská 2579, 400 11 Ústí nad Labem-Severní Terasa
