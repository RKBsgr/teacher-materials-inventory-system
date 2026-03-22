import logo_view from "../assets/view-svgrepo-com.svg";
import logo_download from "../assets/download-minimalistic-svgrepo-com.svg";

export default function MaterialCard({ material, token, API, loadMaterials, isGrid }) {
  async function deleteMaterial() {
    try {
      const res = await fetch(`${API}/api/materials/${material._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) loadMaterials();
    } catch {}
  }

  const fileUrl = material.url;

  const viewUrl = '${fileUrl}?download=false';
  const downloadUrl = '${fileUrl}?download=true';

  /*removed
  const downloadUrl = fileUrl.includes("cloudinary")
    ? fileUrl.replace("/upload/", "/upload/fl_attachment/")
    : fileUrl;*/

/*
  const getCloudinaryUrl = (baseUrl, attachment = false) => {
    if (!baseUrl.includes('cloudinary')) return baseUrl;
    const parts = baseUrl.split('/upload/');
    const afterUpload = parts[1];
    const beforeVersion = afterUpload.split('/v')[0];
    const versionAndAfter = afterUpload.split('/v')[1] || '';
    return parts[0] + '/upload/' + (attachment ? 'fl_attachment/' : '') + beforeVersion + (versionAndAfter ? '/v' + versionAndAfter : '');
  };
  const viewUrl = getCloudinaryUrl(fileUrl, false);
  const downloadUrl = getCloudinaryUrl(fileUrl, true);*/

  // Extract file extension
    const getFileExtension = () => {
      const url = material.url || "";
      return url.split(".").pop().toLowerCase();
    };

  // Get file type icon/emoji
  const getFileTypeIcon = () => {
    const ext = getFileExtension();
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

  return (
    <div className="card">
      {/* File Preview for Grid View */}
      {isGrid && material.category !== "External Link" && (
        <div className="card-preview">
          <div className="preview-icon">{getFileTypeIcon()}</div>
          <span className="preview-ext">.{getFileExtension()}</span>
        </div>
      )}

      {/* Card Content */}
      <div className="card-content">
        <h3 className="card-title">{material.title}</h3>
        
        {/*added*/}
        <p className="uploaded-by">
          Uploaded by: {material.uploadedBy || "Unknown"}
        </p>

        {/* Subject & Type */}
        <div className="card-meta">
          <span className="meta-subject">{material.subject}</span>
          <span className="meta-type">{material.type}</span>
        </div>

        {/* Category Badge */}
        <div className="card-category">
          {material.category === "External Link" ? (
            <span className="cat-badge external">🔗 Link</span>
          ) : (
            <span className="cat-badge uploaded">⬆️ Uploaded</span>
          )}
        </div>
      </div>

      {/* Card Actions */}
      <div className="card-actions">
        {material.category === "External Link" ? (
          <a href={material.url} target="_blank" rel="noreferrer" className="action-link">
            Visit →
          </a>
        ) : (
          <div className="action-icons">
            <a 
              href={viewUrl}
              target="_blank"
              rel="noreferrer"
              title="View"
            >
              <img src={logo_view} alt="View" width={18} height={18}/>
            </a>
            <a
              href={downloadUrl}
              title="Download"
            >
              <img src={logo_download} alt="Download" width={18} height={18}/>
            </a>
          </div>
        )}

        {token && (
          <button className="danger action-delete" onClick={deleteMaterial} title="Delete">
            🗑️
          </button>
        )}
      </div>
    </div>
  );
}

/*https://drive.google.com/file/d/19_oszIeNiUYgwwQjyFxfHZw9ZG2SDics/view */