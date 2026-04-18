import { HealthBadge } from "./shared";
import { WORK_ICONS } from "../data/bonsaiOptions";

export default function BonsaiCard({ bonsai, nextRem, onDelete, onSelect }) {
  return (
    <div className="bonsai-card" onClick={() => onSelect(bonsai)}>
      <div style={{ height: 140, background: "#1a2010", position: "relative" }}>
        {bonsai.foto ? (
          <img src={bonsai.foto} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: 48, opacity: .3 }}>
            🌳
          </div>
        )}
        <button
          onClick={e => {
            e.stopPropagation();
            onDelete(bonsai.id);
          }}
          style={{
            position: "absolute",
            top: 8,
            left: 8,
            background: "#f87171",
            border: "none",
            color: "#fff",
            width: 24,
            height: 24,
            borderRadius: "50%",
            cursor: "pointer",
            fontSize: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          ✕
        </button>
        {bonsai.salute != null && (
          <div style={{ position: "absolute", top: 8, right: 8 }}>
            <HealthBadge score={bonsai.salute} />
          </div>
        )}
      </div>

      <div style={{ padding: "10px 12px" }}>
        <p style={{ fontWeight: 600, fontSize: ".88rem", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {bonsai.nome || bonsai.specie || "Bonsai"}
        </p>
        <p style={{ fontSize: ".75rem", opacity: .5, margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {bonsai.specie || bonsai.nomeComuneIt || "—"}
        </p>
        {nextRem && (
          <p style={{ fontSize: ".7rem", marginTop: 6, color: "var(--moss)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {WORK_ICONS[nextRem.tipo]} {nextRem.nota || nextRem.tipo}
          </p>
        )}
      </div>
    </div>
  );
}
