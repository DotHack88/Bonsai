import { useEffect, useState } from "react";
import { callClaude, HealthBadge } from "./shared";

export default function AiAnalysisPanel({ image, onResult, onClose }) {
  const [status, setStatus] = useState("analyzing");
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (!image) return;

    const content = [
      {
        type: "image",
        source: {
          type: "base64",
          media_type: image.match(/data:(image\/\w+)/)?.[1] || "image/jpeg",
          data: image.split(",")[1]
        }
      }
    ];

    content.push({
      type: "text",
      text: `Analizza questa foto di un bonsai. Rispondi in tre punti distinti: Identificazione, Check della Salute, Consigli di Cura.

IMPORTANTE: 
- Considera che si tratta di un bonsai (pianta coltivata in vaso, spesso miniaturizzata)
- Usa la foto per valutare specie, foglie, terreno e eventuale stress
- Determina anche la macro categoria e la dimensione del bonsai, se possibile
- Non aggiungere spiegazioni fuori dal JSON

Rispondi SOLO con JSON valido e nulla più:
{
  "specie": "nome scientifico esatto (es. Acer palmatum, Ficus retusa)",
  "nomeComuneIt": "nome comune italiano",
  "famiglia": "famiglia botanica (es. Aceraceae, Moraceae)",
  "origine": "regione di origine (es. Giappone, Cina, Europa)",
  "macroCategoria": "Latifoglie (Decidui), Conifere, Tropicali / da Interno, Bonsai da Fiore / Frutto",
  "dimensione": "Mame / Shito (Miniatura) — < 7-10 cm, Shohin (Piccolo) — 10-25 cm, Kifu (Medio-piccolo) — 20-40 cm, Chuhin / Chu (Medio) — 35-70 cm, Omono / Dai (Grande) — 70-120 cm, Imperial / Bonju (Molto Grande) — > 120 cm",
  "identificazione": "Breve testo con nome comune e scientifico insieme",
  "checkSalute": "Analisi dello stato fogliare e del terreno, segni di parassiti, carenze o stress",
  "consigli": "Suggerimenti pratici su luce, irrigazione, rinvaso, e cura generale",
  "salute": punteggio da 0-100 basato su aspetto generale,
  "notesSalute": "Breve nota sullo stato di salute generale",
  "difficolta": "Facile/Media/Difficile",
  "stagioneFogliazione": "quando perde/foglie (es. deciduo, sempreverde)"
}`
    });

    callClaude(
      [{ role: "user", content: content }],
      "Sei un esperto botanico specializzato in bonsai e analisi delle piante. Rispondi in modo preciso e strutturato, usando SOLO JSON valido senza parole inutili."
    )
      .then(text => {
        console.log("Raw AI response:", text);
        try {
          const clean = text.replace(/```json|```/g, "").trim();
          const parsed = JSON.parse(clean);
          setResult(parsed);
          setStatus("done");
        } catch (e) {
          console.error("JSON parse error:", e, "Raw text:", text);
          setResult({
            specie: "Non identificata",
            nomeComuneIt: "Sconosciuto",
            famiglia: "",
            origine: "",
            macroCategoria: "",
            dimensione: "",
            identificazione: "Non disponibile",
            checkSalute: "Analisi non disponibile",
            consigli: "Riprova con foto più nitide da angolazioni diverse",
            salute: null,
            notesSalute: "Analisi non disponibile - riprova con foto più chiare",
            difficolta: "",
            stagioneFogliazione: ""
          });
          setStatus("done");
        }
      })
      .catch(err => {
        console.error("AI Analysis Error:", err);
        setErrorMsg(err.message || "Errore nell'analisi. Controlla la chiave API nel file .env");
        setStatus("error");
      });
  }, [image]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 380 }}>
        <h3 style={{ marginBottom: 16, fontSize: "1.1rem" }}>🤖 Analisi AI Bonsai</h3>

        {status === "analyzing" && (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <div className="spinner" />
            <p style={{ marginTop: 16, opacity: .7, fontSize: "0.9rem" }}>Analisi in corso con foto…</p>
          </div>
        )}

        {status === "error" && (
          <div style={{ background: "#f8717115", border: "1px solid #f87171", borderRadius: 10, padding: 14 }}>
            <p style={{ color: "#f87171", margin: 0, fontSize: "0.9rem", fontWeight: 600 }}>❌ Errore nell'analisi</p>
            <p style={{ color: "#f87171", margin: "8px 0 0", fontSize: "0.8rem", opacity: .8 }}>{errorMsg}</p>
            <p style={{ fontSize: "0.75rem", opacity: .5, margin: "10px 0 0", lineHeight: 1.4 }}>
              Verifica che:<br />• La chiave API sia corretta nel file .env<br />• Hai crediti su Anthropic<br />• La connessione internet funzioni
            </p>
          </div>
        )}

        {status === "done" && result && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div className="info-row"><span>🌳 Specie</span><strong>{result.specie}</strong></div>
            <div className="info-row"><span>🇮🇹 Nome italiano</span><strong>{result.nomeComuneIt}</strong></div>
            {result.famiglia && <div className="info-row"><span>🌿 Famiglia</span><strong>{result.famiglia}</strong></div>}
            {result.origine && <div className="info-row"><span>🏔️ Origine</span><strong>{result.origine}</strong></div>}
            {result.macroCategoria && <div className="info-row"><span>🌱 Categoria</span><strong>{result.macroCategoria}</strong></div>}
            {result.dimensione && <div className="info-row"><span>📏 Dimensione</span><strong>{result.dimensione}</strong></div>}
            {result.identificazione && (
              <div style={{ background: "#ffffff10", borderRadius: 10, padding: "10px 14px" }}>
                <strong style={{ display: "block", marginBottom: 6, fontSize: "0.88rem" }}>🔎 Identificazione</strong>
                <p style={{ fontSize: "0.82rem", margin: 0, opacity: .85 }}>{result.identificazione}</p>
              </div>
            )}
            {result.checkSalute && (
              <div style={{ background: "#fff5cc", borderRadius: 10, padding: "10px 14px" }}>
                <strong style={{ display: "block", marginBottom: 6, fontSize: "0.88rem" }}>🩺 Check della Salute</strong>
                <p style={{ fontSize: "0.82rem", margin: 0, opacity: .85 }}>{result.checkSalute}</p>
              </div>
            )}
            <div className="info-row"><span>❤️ Salute</span><HealthBadge score={result.salute} /></div>
            <div style={{ background: "#ffffff10", borderRadius: 10, padding: "10px 14px" }}>
              <p style={{ fontSize: "0.82rem", margin: 0, opacity: .85 }}>{result.notesSalute}</p>
            </div>
            {result.consigli && (
              <div style={{ background: "#4ade8015", border: "1px solid #4ade8040", borderRadius: 10, padding: "10px 14px" }}>
                <strong style={{ display: "block", marginBottom: 6, fontSize: "0.88rem" }}>💡 Consigli di Cura</strong>
                <p style={{ fontSize: "0.82rem", margin: 0, color: "#4ade80" }}>{result.consigli}</p>
              </div>
            )}
            {result.difficolta && <div className="info-row"><span>🎯 Difficoltà</span><strong>{result.difficolta}</strong></div>}
            {result.stagioneFogliazione && <div className="info-row"><span>🍂 Fogliazione</span><strong>{result.stagioneFogliazione}</strong></div>}
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button className="btn-primary" style={{ flex: 1 }} onClick={() => onResult(result)}>
                ✅ Usa questi dati
              </button>
              <button className="btn-outline" onClick={onClose}>Annulla</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
