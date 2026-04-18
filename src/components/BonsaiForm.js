import { useState } from "react";
import AiAnalysisPanel from "./AiAnalysisPanel";
import { PhotoInput } from "./shared";
import { MACRO_CATEGORIES, STILI, DIMENSIONI } from "../data/bonsaiOptions";

export default function BonsaiForm({ bonsai, onSave, onClose }) {
  const isNew = !bonsai?.id;
  const [form, setForm] = useState(
    bonsai || {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      nome: "",
      specie: "",
      nomeComuneIt: "",
      stile: "",
      eta: "",
      dimensione: "",
      macroCategoria: "",
      acquisito: "",
      foto: null,
      salute: null,
      notesSalute: "",
      note: "",
      lavorazioni: [],
      createdAt: new Date().toISOString()
    }
  );
  const [currentPhoto, setCurrentPhoto] = useState(
    bonsai?.foto ? { src: bonsai.foto, name: "" } : null
  );
  const [showAI, setShowAI] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handlePhotoCapture = (src, name) => {
    setCurrentPhoto({ src, name });
    setForm(f => ({ ...f, foto: src }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
        <h3 style={{ marginBottom: 16 }}>{isNew ? "🌱 Nuovo Bonsai" : "✏️ Modifica Bonsai"}</h3>

        <div style={{ marginBottom: 16 }}>
          {currentPhoto && (
            <div style={{ marginBottom: 12 }}>
              <img
                src={currentPhoto.src}
                alt="Foto bonsai"
                style={{ width: "100%", maxHeight: 200, objectFit: "cover", borderRadius: 8 }}
              />
            </div>
          )}
          <PhotoInput onCapture={handlePhotoCapture} />
          {currentPhoto && !showAI && (
            <button className="btn-outline" style={{ width: "100%", marginTop: 8 }} onClick={() => setShowAI(true)}>
              🤖 Analizza con AI
            </button>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input
            className="input"
            placeholder="Nome (es. Il mio primo ficus)"
            value={form.nome}
            onChange={e => set("nome", e.target.value)}
          />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <input
              className="input"
              placeholder="Specie"
              value={form.specie}
              onChange={e => set("specie", e.target.value)}
            />
            <input
              className="input"
              placeholder="Nome comune"
              value={form.nomeComuneIt}
              onChange={e => set("nomeComuneIt", e.target.value)}
            />
            <select className="input" value={form.stile} onChange={e => set("stile", e.target.value)}>
              <option value="">Stile</option>
              {STILI.map(stile => (
                <option key={stile} value={stile}>{stile}</option>
              ))}
            </select>
            <input
              className="input"
              placeholder="Età stimata (anni)"
              value={form.eta}
              onChange={e => set("eta", e.target.value)}
              type="number"
            />
            <select className="input" value={form.macroCategoria} onChange={e => set("macroCategoria", e.target.value)}>
              <option value="">Macro categoria</option>
              {MACRO_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select className="input" value={form.dimensione} onChange={e => set("dimensione", e.target.value)}>
              <option value="">Dimensione</option>
              {DIMENSIONI.map(dim => (
                <option key={dim} value={dim}>{dim}</option>
              ))}
            </select>
          </div>
          <input
            className="input"
            type="date"
            value={form.acquisito}
            onChange={e => set("acquisito", e.target.value)}
            style={{ colorScheme: "dark" }}
            title="Data di acquisizione"
          />
          <textarea
            className="input"
            placeholder="Note generali…"
            value={form.note}
            rows={2}
            onChange={e => set("note", e.target.value)}
            style={{ resize: "vertical" }}
          />
        </div>

        {form.salute != null && (
          <div style={{ marginTop: 12, background: "#ffffff08", borderRadius: 10, padding: "10px 14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.8rem", opacity: .7 }}>Salute rilevata AI</span>
              <span>{form.salute}%</span>
            </div>
            {form.notesSalute && <p style={{ fontSize: "0.78rem", margin: "6px 0 0", opacity: .7 }}>{form.notesSalute}</p>}
          </div>
        )}

        <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
          <button className="btn-primary" style={{ flex: 1 }} onClick={() => onSave(form)}>
            💾 Salva
          </button>
          <button className="btn-outline" onClick={onClose}>Annulla</button>
        </div>

        {showAI && currentPhoto && (
          <AiAnalysisPanel
            image={currentPhoto.src}
            onResult={r => {
              setForm(f => ({
                ...f,
                specie: r.specie || f.specie,
                nomeComuneIt: r.nomeComuneIt || f.nomeComuneIt,
                macroCategoria: r.macroCategoria || f.macroCategoria,
                dimensione: r.dimensione || f.dimensione,
                salute: r.salute,
                notesSalute: r.notesSalute
              }));
              setShowAI(false);
            }}
            onClose={() => setShowAI(false)}
          />
        )}
      </div>
    </div>
  );
}
