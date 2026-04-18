# 🌳 Bonsai Manager - React App

Una completa app web per la gestione della tua collezione di bonsai con AI-powered analysis, meteo integrato e statistiche avanzate.

## 🚀 Caratteristiche

- **📸 Analisi AI**: Identifica specie di bonsai tramite foto con Claude AI
- **📊 Statistiche**: Dashboard con grafici di attività, salute media e distribuzione lavorazioni
- **🌦️ Meteo integrato**: Previsioni meteo locali e consigli AI personalizzati per la stagione
- **📅 Calendario**: Pianifica lavorazioni e promemoria interattivi
- **❤️ Monitoraggio salute**: Traccia lo stato di salute di ogni pianta
- **📱 Mobile-first**: Perfettamente ottimizzata per smartphone
- **💾 Offline-first**: Dati salvati in localStorage, funziona offline

## 📋 Prerequisiti

- Node.js 16+ e npm
- Chiave API [Anthropic Claude](https://console.anthropic.com)

## 🔧 Setup locale

### 1. Installazione
```bash
cd Bonsai
npm install
```

### 2. Configurare le API Keys

Crea un file `.env` nella root del progetto:

```
REACT_APP_CLAUDE_API_KEY=sk-ant-xxx...
```

> Ottieni la tua chiave API di Claude da: https://console.anthropic.com/account/keys

### 3. Avviare in sviluppo
```bash
npm run dev
```

Questo comando avvierà sia il client React (su `http://localhost:3000`) che il server backend (su `http://localhost:3004`).

> In alternativa, puoi avviare client e server separatamente:
> - Client: `npm start`
> - Server: `npm run server`

## 🌐 Deployment su Vercel

### Preparazione
Prima di collegare la repository GitHub, assicurati di avere la chiave API di Claude pronta.

### 1. Creare il Secret su Vercel
1. Vai su [Vercel Dashboard](https://vercel.com/dashboard)
2. Nella sezione "Secrets" (o "Environment Variables" se è un progetto esistente), crea un nuovo secret:
   - **Name**: `claude_api_key`
   - **Value**: La tua chiave API di Claude (sk-ant-xxx...)
   - **Environment**: Production (e Development se necessario)

### 2. Collegare la Repository GitHub
```bash
npm install -g vercel
vercel
```
Segui le istruzioni per collegare la tua repository GitHub. Vercel rileverà automaticamente la configurazione da `vercel.json`.

### 3. Verifica il Deployment
Dopo il deployment, l'app sarà disponibile su un URL fornito da Vercel. Il server backend gestirà automaticamente le richieste API a Claude.

> **Nota**: Se ricevi errori relativi al secret mancante, assicurati di aver creato il secret `claude_api_key` prima di collegare la repository.
```

Durante il setup, quando ti viene chiesto della variabile di ambiente, inserisci:
- **Nome**: `REACT_APP_CLAUDE_API_KEY`
- **Valore**: Tua chiave API di Claude

### Opzione 2: Deploy da GitHub (consigliato)

1. **Crea un repository GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/username/bonsai-app.git
   git push -u origin main
   ```

2. **Collega a Vercel**
   - Vai su [vercel.com](https://vercel.com)
   - Clicca "New Project"
   - Seleziona il repository GitHub
   - Aggiungi la variabile di ambiente `REACT_APP_CLAUDE_API_KEY`
   - Clicca "Deploy"

3. **La tua app è online!** 🎉
   - Riceverai un URL pubblico (es: `bonsai-app-xyz.vercel.app`)
   - Accessibile da qualsiasi device con il link

## 📱 Accesso da smartphone

Una volta deployato su Vercel:
1. Apri il link pubblico da qualsiasi browser mobile
2. Aggiungi alla home screen per un'esperienza simile a un'app nativa
3. La geolocalizzazione verrà richiesta al primo accesso per il meteo

## 🛠️ Comandi disponibili

```bash
npm start          # Avvia app in sviluppo
npm run build      # Build per produzione
npm run eject      # Esce dalla configurazione CRA (non reversibile)
```

## 🔌 Variabili di ambiente

- `REACT_APP_CLAUDE_API_KEY` - Chiave API Anthropic (required)

## 🌐 API esterne utilizzate

- **Anthropic Claude API** - Analisi AI e generazione consigli
- **Open-Meteo API** - Dati meteo (no API key needed)
- **Nominatim API** - Reverse geocoding per città (no API key needed)

## 📂 Struttura progetto

```
bonsai-app/
├── public/
│   └── index.html
├── src/
│   ├── App.js          (main app component)
│   ├── index.css       (global styles)
│   └── index.js
├── .env                (API keys - non committare!)
├── .gitignore
└── package.json
```

## 🚨 Note sulla sicurezza

⚠️ **Importante**: La chiave API di Claude viene utilizzata dal client (browser). Per un'app di produzione, considera:
- Creare un backend proxy per le richieste API
- Implementare rate limiting
- Usare API keys con scope limitato

## 🐛 Troubleshooting

**Errore: "Chiave API di Claude non trovata"**
- Verifica che il file `.env` esista nella root
- Riavvia il server di sviluppo dopo aver aggiunto `.env`
- Su Vercel, controlla le Environment Variables nel dashboard

**Geolocalizzazione non funziona**
- Assicurati che il sito sia servito su HTTPS (Vercel lo fa automaticamente)
- Concedi i permessi di posizione al browser

**Le foto non si caricano da smartphone**
- Verifica i permessi della fotocamera nel browser
- Prova con una connessione dati più stabile

## 📞 Support

Per problemi, consulta:
- [Anthropic API Docs](https://docs.anthropic.com)
- [Open-Meteo API](https://open-meteo.com)

---

**Buona cura dei tuoi bonsai! 🌳✨**

