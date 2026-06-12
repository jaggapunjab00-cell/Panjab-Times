import { useState, useRef, useCallback, useEffect } from 'react';

const MAX_TITLE = 200;
const MAX_BODY  = 50000;
const MAX_MB    = 5;

function CharMeter({ value, max }) {
  const pct = (value / max) * 100;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{
        width: '48px', height: '3px',
        background: '#E4E4DF', borderRadius: '99px', overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${Math.min(100, pct)}%`,
          borderRadius: '99px',
          background: pct > 95 ? '#dc2626' : pct > 80 ? '#d97706' : '#0F172A',
          transition: 'width 0.15s ease, background 0.15s ease',
        }} />
      </div>
      <span style={{
        fontFamily: "'Outfit', system-ui, sans-serif",
        fontSize: '0.68rem',
        color: pct > 95 ? '#dc2626' : '#718096',
        transition: 'color 0.15s',
      }}>
        {value.toLocaleString()}
      </span>
    </div>
  );
}

export default function PublishModal({ onClose, onPublished }) {
  const [author,    setAuthor]    = useState('');
  const [title,     setTitle]     = useState('');
  const [body,      setBody]      = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [preview,   setPreview]   = useState(null);
  const [dragOver,  setDragOver]  = useState(false);
  const [step,      setStep]      = useState(1);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');

  const overlayRef = useRef(null);
  const fileRef    = useRef(null);
  const authorRef  = useRef(null);

  useEffect(() => { setTimeout(() => authorRef.current?.focus(), 80); }, []);
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);
  useEffect(() => {
    const fn = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  const attachImage = useCallback((file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Only image files are supported.'); return; }
    if (file.size > MAX_MB * 1024 * 1024) { setError(`Image must be under ${MAX_MB} MB.`); return; }
    setError('');
    setImageFile(file);
    const r = new FileReader();
    r.onload = e => setPreview(e.target.result);
    r.readAsDataURL(file);
  }, []);

  const validate = () => {
    if (!author.trim()) return 'Enter your name.';
    if (!title.trim())  return 'Enter a headline.';
    if (!body.trim() || body.trim().length < 50) return 'Write at least 50 characters.';
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError(''); setLoading(true);
    try {
      const fd = new FormData();
      fd.append('author', author.trim());
      fd.append('title',  title.trim());
      fd.append('body',   body.trim());
      if (imageFile) fd.append('image', imageFile);
      const res  = await fetch('/api/articles', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Publish failed.'); return; }
      onPublished?.(data.data);
      onClose();
    } catch { setError('Network error. Check your connection.'); }
    finally  { setLoading(false); }
  };

  const words    = body.trim().split(/\s+/).filter(Boolean).length;
  const readEst  = Math.max(1, Math.ceil(words / 200));

  return (
    <div
      className="modal-backdrop"
      ref={overlayRef}
      onClick={e => e.target === overlayRef.current && onClose()}
    >
      <div className="modal-sheet" style={{ maxWidth: '660px', width: '100%', maxHeight: '94vh', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div style={{
          padding: '1.4rem 1.75rem 1.1rem',
          borderBottom: '1px solid #E4E4DF',
          display: 'flex', alignItems: 'flex-start',
          justifyContent: 'space-between', flexShrink: 0,
        }}>
          <div>
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '1.4rem', color: '#020617', lineHeight: 1.2,
            }}>
              {step === 1 ? 'Write your article' : 'Preview'}
            </h2>
            <p style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontSize: '0.75rem', color: '#718096', marginTop: '3px' }}>
              {step === 1 ? 'Share your story with all of Punjab' : 'This is how readers will see it'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Step pills */}
            <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
              {[1,2].map(s => (
                <div key={s} style={{
                  height: '5px',
                  width: s === step ? '20px' : '8px',
                  borderRadius: '99px',
                  background: s === step ? '#020617' : s < step ? '#F59E0B' : '#E4E4DF',
                  transition: 'all 0.25s ease',
                }} />
              ))}
            </div>
            <button className="modal-close" style={{ position: 'static' }} onClick={onClose}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ overflowY: 'auto', flex: 1 }}>

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <div style={{ padding: '1.5rem 1.75rem' }}>

              {error && (
                <div style={{
                  background: '#fef2f2', border: '1px solid #fca5a5',
                  padding: '0.7rem 1rem', marginBottom: '1.25rem',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  fontFamily: "'Outfit', system-ui, sans-serif", fontSize: '0.82rem', color: '#dc2626',
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {error}
                </div>
              )}

              {/* Author */}
              <div style={{ marginBottom: '1.1rem' }}>
                <label className="field-label" htmlFor="p-author">Your Name</label>
                <input id="p-author" ref={authorRef} className="field-input"
                  type="text" placeholder="e.g. Bilal Ahmed"
                  value={author} maxLength={80}
                  onChange={e => setAuthor(e.target.value)} disabled={loading} />
              </div>

              {/* Title */}
              <div style={{ marginBottom: '1.1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label className="field-label" style={{ margin: 0 }} htmlFor="p-title">Headline</label>
                  <CharMeter value={title.length} max={MAX_TITLE} />
                </div>
                <input id="p-title" className="field-input"
                  type="text" placeholder="A clear, compelling headline…"
                  value={title} maxLength={MAX_TITLE}
                  onChange={e => setTitle(e.target.value)} disabled={loading}
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.05rem' }} />
              </div>

              {/* Body */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label className="field-label" style={{ margin: 0 }} htmlFor="p-body">Article</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {words > 0 && (
                      <span style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontSize: '0.68rem', color: '#718096' }}>
                        ~{readEst} min read
                      </span>
                    )}
                    <CharMeter value={body.length} max={MAX_BODY} />
                  </div>
                </div>
                <textarea id="p-body" className="field-textarea"
                  placeholder={"Write your article here…\n\nPress Enter twice between paragraphs."}
                  value={body} maxLength={MAX_BODY}
                  onChange={e => setBody(e.target.value)} disabled={loading}
                  style={{ minHeight: '240px' }} />
              </div>

              {/* Image upload */}
              <div>
                <label className="field-label">
                  Cover Image
                  <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: '#718096', marginLeft: '6px', fontSize: '0.7rem' }}>
                    optional · max {MAX_MB} MB
                  </span>
                </label>

                {preview ? (
                  <div style={{ position: 'relative', overflow: 'hidden' }}>
                    <img src={preview} alt="Preview"
                      style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', display: 'block' }} />
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
                      padding: '1rem 0.8rem 0.65rem',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}>
                      <span style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontSize: '0.72rem', color: 'rgba(255,255,255,0.85)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>
                        {imageFile?.name}
                      </span>
                      <button onClick={() => { setImageFile(null); setPreview(null); if (fileRef.current) fileRef.current.value = ''; }}
                        style={{ background: 'rgba(220,38,38,0.85)', border: 'none', color: '#fff', fontSize: '0.7rem', fontWeight: 600, padding: '3px 10px', cursor: 'pointer', fontFamily: "'Outfit', system-ui, sans-serif" }}>
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`upload-zone ${dragOver ? 'drag-active' : ''}`}
                    onDrop={e => { e.preventDefault(); setDragOver(false); attachImage(e.dataTransfer.files?.[0]); }}
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                  >
                    <input ref={fileRef} type="file" accept="image/*"
                      onChange={e => attachImage(e.target.files?.[0])} disabled={loading} />
                    <div style={{ pointerEvents: 'none' }}>
                      <div style={{
                        width: '42px', height: '42px', borderRadius: '50%',
                        background: dragOver ? 'rgba(232,150,12,0.1)' : 'rgba(0,0,0,0.05)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 0.75rem', transition: 'background 0.15s',
                      }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                          stroke={dragOver ? '#F59E0B' : '#4A5568'}
                          strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="16 16 12 12 8 16"/>
                          <line x1="12" y1="12" x2="12" y2="21"/>
                          <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
                        </svg>
                      </div>
                      <p style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontSize: '0.85rem', fontWeight: 500, color: '#020617', marginBottom: '3px' }}>
                        {dragOver ? 'Drop image here' : 'Drag & drop or click to upload'}
                      </p>
                      <p style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontSize: '0.72rem', color: '#718096' }}>
                        JPG, PNG, WebP up to {MAX_MB} MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── STEP 2 PREVIEW ── */}
          {step === 2 && (
            <div>
              {preview
                ? <img src={preview} alt="Cover" style={{ width: '100%', maxHeight: '260px', objectFit: 'cover', display: 'block' }} />
                : <div style={{ width: '100%', height: '100px', background: 'linear-gradient(135deg, #020617, #0F172A)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', color: 'rgba(232,150,12,0.15)' }}>PT</span>
                  </div>
              }
              <div style={{ padding: '1.75rem 1.75rem 2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.85rem' }}>
                  <div style={{ width: '20px', height: '2px', background: '#F59E0B' }} />
                  <span style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#F59E0B' }}>Preview</span>
                </div>
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.2rem, 3vw, 1.7rem)', color: '#020617', lineHeight: 1.22, marginBottom: '1rem' }}>
                  {title || 'Your headline'}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '1rem', borderBottom: '1px solid #E4E4DF', marginBottom: '1.25rem' }}>
                  <span className="avatar" style={{ width: 34, height: 34, fontSize: '0.72rem', background: '#0F172A' }}>
                    {author ? author.split(' ').slice(0,2).map(w => w[0]?.toUpperCase()).join('') : '?'}
                  </span>
                  <div>
                    <p style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 600, fontSize: '0.82rem', color: '#020617' }}>{author || 'Your name'}</p>
                    <p style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontSize: '0.7rem', color: '#718096' }}>Just now · {readEst} min read</p>
                  </div>
                </div>
                <div style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontSize: '0.95rem', lineHeight: 1.8, color: '#1A1A1A', maxHeight: '240px', overflowY: 'auto' }}>
                  {body
                    ? body.split(/\n+/).map(p => p.trim()).filter(Boolean).map((p, i) => <p key={i} style={{ marginBottom: '1rem' }}>{p}</p>)
                    : <p style={{ color: '#718096', fontStyle: 'italic' }}>Your article will appear here…</p>
                  }
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '1rem 1.75rem',
          borderTop: '1px solid #E4E4DF',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: '10px',
          background: '#FAFAF7', flexShrink: 0,
        }}>
          <div>
            {step === 2 && (
              <button className="btn-outline" onClick={() => { setStep(1); setError(''); }} disabled={loading}>
                ← Edit
              </button>
            )}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {step === 1 && <button className="btn-outline" onClick={onClose} disabled={loading}>Cancel</button>}
            {step === 1 && (
              <button className="btn-ink" onClick={() => { const e = validate(); if (e) { setError(e); return; } setError(''); setStep(2); }}>
                Preview →
              </button>
            )}
            {step === 2 && (
              <button className="btn-saffron" onClick={handleSubmit} disabled={loading} style={{ minWidth: '140px', justifyContent: 'center' }}>
                {loading
                  ? <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Publishing…</>
                  : <>Publish Article <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"/><path d="M22 2L15 22 11 13 2 9l20-7z"/></svg></>
                }
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}