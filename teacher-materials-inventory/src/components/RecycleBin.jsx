export default function RecycleBin({
  bin,
  API,
  token,
  loadBin,
  loadMaterials,
  viewMode
}) {
  async function restore(id) {
    try {
      const res = await fetch(`${API}/api/materials/${id}/restore`, {
        method: "POST",
        headers: { Authorization: token }
      });
      if (res.ok) {
        loadBin();
        loadMaterials();
      }
    } catch {}
  }

  // helper to pick a file icon based on extension (copy from MaterialCard)
  const getFileExtension = (url = "") => {
    if (typeof url !== "string") return "";
    const parts = url.split(".");
    if (parts.length === 0) return "";
    const ext = parts.pop().toLowerCase();
    return ext;
  };

  const getFileTypeIcon = (url = "") => {
    const ext = getFileExtension(url);
    const iconMap = {
      pdf: "📄",
      doc: "📘", docx: "📘",
      ppt: "🎯", pptx: "🎯",
      xls: "📊", xlsx: "📊",
      mp4: "🎥", mov: "🎥", avi: "🎥",
      mp3: "🎵", wav: "🎵",
      zip: "📦", rar: "📦",
      txt: "📝",
      jpg: "🖼️", jpeg: "🖼️", png: "🖼️", gif: "🖼️"
    };
    return iconMap[ext] || "📎";
  };

  const isGrid = viewMode === "grid";

  return (
    <div className={isGrid ? "grid-layout" : "list-layout"}>
      {(Array.isArray(bin) ? bin : []).map(m => (
        <div key={m._id} className="card recycle-card">
          {isGrid && m.category !== "External Link" && (
            <div className="card-preview">
              <div className="preview-icon">{getFileTypeIcon(m.url)}</div>
              <span className="preview-ext">.{getFileExtension(m.url)}</span>
            </div>
          )}

          <div className="card-content">
            <h3 className="card-title">{m.title}</h3>
            <div className="card-meta">
              <span className="meta-subject">{m.subject}</span>
              <span className="meta-type">{m.type}</span>
            </div>
            <div className="card-category">
              {m.category === "External Link" ? (
                <span className="cat-badge external">🔗 Link</span>
              ) : (
                <span className="cat-badge uploaded">⬆️ Uploaded</span>
              )}
            </div>
          </div>

          <div className="card-actions">
            <button className="primary-btn" onClick={() => restore(m._id)}>
              Restore
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}