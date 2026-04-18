import { useRef } from "react";

export async function callClaude(messages, systemPrompt) {
  const apiKey = process.env.REACT_APP_CLAUDE_API_KEY;
  if (!apiKey) {
    throw new Error("Manca la chiave API di Claude. Aggiungi REACT_APP_CLAUDE_API_KEY nel file .env");
  }

  const res = await fetch("http://localhost:3004/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1000,
      system: systemPrompt,
      messages
    })
  });

  const data = await res.json();
  return data.content?.[0]?.text || "";
}

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
        onChange={e => {
          const f = e.target.files[0];
          if (!f) return;
          const r = new FileReader();
          r.onload = ev => onCapture(ev.target.result, f.name);
          r.readAsDataURL(f);
          fileRef.current.removeAttribute("capture");
        }}
      />
    </div>
  );
}
