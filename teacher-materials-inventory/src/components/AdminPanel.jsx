import { useState, useRef } from "react";

export default function AdminPanel({
  API,
  subjects,
  setSubjects,
  types,
  setTypes,
  adminToken,
  loadMaterials,
  loadSubjects,
  loadTypes,
  showBin,
  setShowBin,
  loadBin
}) {
  const [form, setForm] = useState({
    title: "",
    subject: "",
    category: "Uploaded",
    type: "PDF",
    url: "",
    file: null
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null); // track the hidden file input

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function clearFile() {
    // remove selection and reset underlying input so the same file can be
    // chosen again if needed
    setForm({ ...form, file: null });
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function addMaterial() {
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("subject", form.subject);
    formData.append("category", form.category);
    formData.append("type", form.type);

    if (form.category === "Uploaded") { // file upload
      if (!form.file) return alert("Please select a file");
      formData.append("file", form.file);
    } else { // external link
      if (!form.url) return alert("Please enter a URL");
      formData.append("url", form.url);
    }

    const res = await fetch(`${API}/api/materials`, {
      method: "POST",
      headers: {
        Authorization: adminToken // <- make sure token is sent
      },
      body: formData
    });

    if (!res.ok) {
      alert("Failed to add material");
      return;
    }

    // reload materials
    loadMaterials();
    loadTypes();

    // reset form
    setForm({
      title: "",
      subject: "",
      category: "Encoded",
      type: "PDF",
      url: "",
      file: null
    });
    setSelectedFile(null);
  }

  return (
    <div className="admin-panel-container">
      {/* Admin Header with Actions */}
      <div className="admin-header">
        <div className="admin-title-section">
          <h2>📚 Admin Dashboard</h2>
          <p>Manage your teaching materials</p>
        </div>
        <button
          className={`recycle-btn ${showBin ? 'active' : ''}`}
          onClick={async () => {
            if (!showBin) await loadBin();
            setShowBin(!showBin);
          }}
        >
          {showBin ? "← Back to Materials" : "🗑️ Recycle Bin"}
        </button>
      </div>

      {/* Add Material Form */}
      {!showBin && (
        <div className="admin-form-card">
          <div className="form-card-header">
            <h3>📝 Add New Material</h3>
          </div>

          <div className="admin-form">
            {/* Basic Info Section */}
            <div className="form-section">
              <h4 className="form-section-title">Basic Information</h4>
              
              <div className="form-group">
                <label>Title</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter material title"
                />
              </div>
            </div>

            {/* Subject & Category Section */}
            <div className="form-section">
              <h4 className="form-section-title">Classification</h4>

              <div className="form-group">
                <label>Subject</label>
                <select
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                >
                  <option value="">Select Subject</option>
                  {subjects.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Add New Subject</label>
                <input
                  placeholder="Create new subject..."
                  onBlur={e => {
                    const newSubject = e.target.value.trim();
                    if (newSubject && !subjects.includes(newSubject)) {
                      setSubjects([...subjects, newSubject]);
                      setForm({ ...form, subject: newSubject });
                    }
                  }}
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="Uploaded">Uploaded</option>
                  <option value="External Link">External Link</option>
                </select>
              </div>
            </div>

            {/* File/URL Section */}
            <div className="form-section">
              <h4 className="form-section-title">Content</h4>

              {form.category === "Uploaded" ? (
                <div className="form-group">
                  <label>Upload File</label>
                  <input
                    type="file"
                    hidden
                    id="fileUpload"
                    ref={fileInputRef}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      setForm({ ...form, file });
                      setSelectedFile(file);
                    }}
                  />
                  <label htmlFor="fileUpload" className="custom-file-btn">
                    📎 Choose File
                  </label>
                  {selectedFile && (
                    <span className="file-name">
                      {selectedFile.name}
                      <button
                        type="button"
                        className="clear-file-btn"
                        onClick={clearFile}
                        title="Remove file"
                      >
                        ✖
                      </button>
                    </span>
                  )}
                </div>
              ) : (
                <div className="form-group">
                  <label>External URL</label>
                  <input
                    name="url"
                    value={form.url}
                    onChange={handleChange}
                    placeholder="https://example.com"
                  />
                </div>
              )}
            </div>

            {/* Type Section */}
            <div className="form-section">
              <h4 className="form-section-title">Type</h4>

              <div className="form-group">
                <label>Material Type</label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                >
                  {types.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Add New Type</label>
                <input
                  placeholder="Create new type..."
                  onBlur={e => {
                    const newType = e.target.value.trim();
                    if (newType && !types.includes(newType)) {
                      setTypes([...types, newType]);
                      setForm({ ...form, type: newType });
                    }
                  }}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button className="primary-btn" onClick={addMaterial}>
              ✨ Add Material
            </button>
          </div>
        </div>
      )}
    </div>
  );
}