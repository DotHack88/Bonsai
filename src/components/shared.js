import { useRef } from "react";

// ── API base URL ───────────────────────────────────────────────────────────────
// In sviluppo locale: REACT_APP_API_URL=http://localhost:3004 (nel file .env)
// In produzione Vercel: lascia REACT_APP_API_URL vuoto → usa URL relativo /api/claude
const API_BASE = process.env.REACT_APP_API_URL ?? "";

// ── Compressione immagini ──────────────────────────────────────────────────────
// Ridimensiona a max 1024px e comprime JPEG 0.75 prima di salvare in localStorage
// Una foto da smartphone può pesare 3–5 MB; compressa scende a ~100–300 KB
function compressImage(dataUrl, maxPx = 1024, quality = 0.75) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d").drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

// ── callClaude ─────────────────────────────────────────────────────────────────
// Il client non conosce mai la chiave API: passa sempre per il proxy server/serverless.
// La chiave vive solo in server.js (locale) o nella variabile CLAUDE_API_KEY di Vercel.
export async function callClaude(messages, systemPrompt) {
  const res = await fetch(`${API_BASE}/api/claude`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1000,
      system: systemPrompt,
      messages
    })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err?.error?.message ||
      `Errore del server proxy (${res.status}). Verifica che il server sia avviato.`
    );
  }

  const data = await res.json();
  return data.content?.[0]?.text || "";
}

// ── HealthBadge ────────────────────────────────────────────────────────────────
export function HealthBadge({ score }) {
  if (score == null) return null;
  const s = parseInt(score, 10);
  const color = s >= 80 ? "#4ade80" : s >= 50 ? "#facc15" : "#f87171";
  const label = s >= 80 ? "Ottima" : s >= 50 ? "Discreta" : "Attenzione";
  return (
    <span
      style={{
        background: color + "22",
        border: `1px solid ${color}`,
        color,
        fontSize: "0.7rem",
        fontWeight: 700,
        padding: "2px 8px",
        borderRadius: 20,
        display: "inline-flex",
        alignItems: "center",
        gap: 4
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: color,
          display: "inline-block"
        }}
      />
      {label} {s}%
    </span>
  );
}

// ── PhotoInput ─────────────────────────────────────────────────────────────────
export function PhotoInput({ onCapture }) {
  const fileRef = useRef();
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <button className="btn-outline" onClick={() => fileRef.current.click()} style={{ flex: 1 }}>
        📁 Galleria
      </button>
      <button
        className="btn-outline"
        onClick={() => {
          fileRef.current.setAttribute("capture", "environment");
          fileRef.current.click();
        }}
        style={{ flex: 1 }}
      >
        📷 Scatta
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={async e => {
          const f = e.target.files[0];
          if (!f) return;
          const reader = new FileReader();
          reader.onload = async ev => {
            try {
              // Comprime prima di salvare (fix localStorage saturation)
              const compressed = await compressImage(ev.target.result);
              onCapture(compressed, f.name);
            } catch {
              // Fallback: usa immagine originale se la compressione fallisce
              onCapture(ev.target.result, f.name);
            }
            fileRef.current.removeAttribute("capture");
          };
          reader.readAsDataURL(f);
        }}
      />
    </div>
  );
}
