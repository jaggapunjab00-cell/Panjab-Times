import { useEffect, useRef, useState } from 'react';

export default function MetricsModal({ onClose }) {
  const overlayRef = useRef(null);
  const [metrics, setMetrics] = useState({ visits: 0, reads: 0 });
  const [loading, setLoading] = useState(true);

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
    fetch('/api/metrics')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMetrics({ visits: data.visits, reads: data.reads });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div
      className="modal-backdrop"
      ref={overlayRef}
      onClick={e => e.target === overlayRef.current && onClose()}
    >
      <div className="modal-sheet" style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column' }}>

        <button className="modal-close" onClick={onClose} aria-label="Close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <div style={{ padding: '2.5rem' }}>
          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '1.8rem',
            color: '#020617',
            marginBottom: '2rem',
            textAlign: 'center',
          }}>
            Site Metrics
          </h2>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="spin" style={{ margin: '0 auto', color: '#F59E0B' }}>
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ background: 'var(--paper-2)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                <p style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--slate)', marginBottom: '0.5rem' }}>Total Visits</p>
                <p style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontSize: '2.5rem', fontWeight: 700, color: 'var(--ink)', lineHeight: 1 }}>{metrics.visits.toLocaleString()}</p>
              </div>

              <div style={{ background: 'var(--saffron-bg)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', border: '1px solid var(--saffron-glow)' }}>
                <p style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--saffron-2)', marginBottom: '0.5rem' }}>Article Reads</p>
                <p style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontSize: '2.5rem', fontWeight: 700, color: 'var(--ink)', lineHeight: 1 }}>{metrics.reads.toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
