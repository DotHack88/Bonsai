import { MACRO_CATEGORIES, STILI, DIMENSIONI, HEALTH_FILTER_OPTIONS } from "../data/bonsaiOptions";

export default function FilterBar({
  searchQuery,
  setSearchQuery,
  filterCategoria,
  setFilterCategoria,
  filterStile,
  setFilterStile,
  filterDimensione,
  setFilterDimensione,
  filterSalute,
  setFilterSalute
}) {
  return (
    <div style={{ display: "grid", gap: 10, marginBottom: 18 }}>
      <input
        className="input"
        placeholder="Cerca per nome, specie, categoria, stile, dimensione..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <select className="input" value={filterCategoria} onChange={e => setFilterCategoria(e.target.value)}>
          <option value="">Tutte le macro categorie</option>
          {MACRO_CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select className="input" value={filterStile} onChange={e => setFilterStile(e.target.value)}>
          <option value="">Tutti gli stili</option>
          {STILI.map(stile => (
            <option key={stile} value={stile}>{stile}</option>
          ))}
        </select>
        <select className="input" value={filterDimensione} onChange={e => setFilterDimensione(e.target.value)}>
          <option value="">Tutte le dimensioni</option>
          {DIMENSIONI.map(dim => (
            <option key={dim} value={dim}>{dim}</option>
          ))}
        </select>
        <select className="input" value={filterSalute} onChange={e => setFilterSalute(e.target.value)}>
          {HEALTH_FILTER_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
