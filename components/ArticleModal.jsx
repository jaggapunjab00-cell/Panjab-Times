import { useEffect, useRef } from 'react';
import { format } from 'date-fns';

const AVATAR_COLORS = [
  '#020617','#0F172A','#2C3E6B','#4A3728',
  '#1A4A4A','#3D2B6B','#5C3317','#2D4A1E',
];

function avatarColor(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

function initials(name) {
  return name.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() || '').join('');
}

export default function ArticleModal({ article, onClose }) {
  const overlayRef = useRef(null);

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

  useEffect(() => {
    if (article?._id) {
      fetch(`/api/articles/${article._id}`, { method: 'PATCH' }).catch(console.error);
    }
  }, [article?._id]);

  if (!article) return null;

  const { author, title, body, imageUrl, createdAt, readTime } = article;
  const publishedDate = createdAt ? format(new Date(createdAt), "MMMM d, yyyy 'at' h:mm a") : '';
  const paragraphs = body.split(/\n+/).map(p => p.trim()).filter(Boolean);
  const bg = avatarColor(author);
  const ini = initials(author);

  return (
    <div
      className="modal-backdrop"
      ref={overlayRef}
      onClick={e => e.target === overlayRef.current && onClose()}
    >
      <div className="modal-sheet" style={{ maxWidth: '760px', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}>

        <button className="modal-close" onClick={onClose} aria-label="Close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <div style={{ overflowY: 'auto', flex: 1 }}>

          {/* Cover image */}
          {imageUrl && (
            <div style={{ width: '100%', maxHeight: '400px', overflow: 'hidden', background: '#111' }}>
              <img src={imageUrl} alt={title}
                style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', display: 'block' }} />
            </div>
          )}

          {!imageUrl && (
            <div style={{
              width: '100%', height: '140px',
              background: 'linear-gradient(135deg, #020617 0%, #0F172A 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: '4rem', color: 'rgba(232,150,12,0.12)', userSelect: 'none',
              }}>PT</span>
            </div>
          )}

          <div style={{ padding: '2.25rem 2.75rem 3rem' }}>

            {/* Eyebrow */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
              <div style={{ width: '28px', height: '2px', background: '#F59E0B' }} />
              <span style={{
                fontFamily: "'Outfit', system-ui, sans-serif",
                fontSize: '0.62rem', fontWeight: 600,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: '#F59E0B',
              }}>Article</span>
            </div>

            {/* Title */}
            <h1 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(1.6rem, 3.5vw, 2.3rem)',
              lineHeight: 1.2,
              color: '#020617',
              marginBottom: '1.5rem',
              paddingRight: '2.5rem',
              letterSpacing: '-0.01em',
            }}>
              {title}
            </h1>

            {/* Byline */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              paddingBottom: '1.5rem',
              borderBottom: '1px solid #E4E4DF',
              marginBottom: '2rem',
            }}>
              <span className="avatar" style={{
                width: 46, height: 46,
                background: bg,
                fontSize: '1rem',
              }}>{ini}</span>
              <div>
                <p style={{
                  fontFamily: "'Outfit', system-ui, sans-serif",
                  fontWeight: 600, fontSize: '0.95rem', color: '#020617',
                  marginBottom: '2px',
                }}>{author}</p>
                <p style={{
                  fontFamily: "'Outfit', system-ui, sans-serif",
                  fontSize: '0.75rem', color: '#718096',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  <span>{publishedDate}</span>
                  <span style={{ opacity: 0.4 }}>·</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    {readTime} min read
                  </span>
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="article-body-text">
              {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            </div>

            {/* End rule */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              marginTop: '2.5rem', paddingTop: '1.5rem',
              borderTop: '1px solid #E4E4DF',
            }}>
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, #F59E0B, transparent)', opacity: 0.5 }} />
              <span style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: '0.85rem', fontStyle: 'italic', color: '#718096',
              }}>The Punjab Times</span>
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, #F59E0B)', opacity: 0.5 }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}