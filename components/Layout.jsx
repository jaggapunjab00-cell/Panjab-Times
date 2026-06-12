import Head from 'next/head';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import LocationCounter from './LocationCounter';
import MetricsModal from './MetricsModal';

export default function Layout({ children, title, onPublish }) {
  const [today,    setToday]    = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false);

  useEffect(() => {
    setToday(format(new Date(), "EEEE, MMMM d, yyyy"));
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <>
      <Head>
        <title>{title ? `${title} — The Punjab Times` : 'The Punjab Times'}</title>
        <meta name="description" content="Stories from the heart of Punjab — read and publish articles from every corner of the province." />
        <meta name="theme-color" content="#020617" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap"
          rel="stylesheet"
        />
      </Head>

      <header
        className="masthead"
        style={{
          boxShadow: scrolled ? '0 2px 24px rgba(0,0,0,0.45)' : 'none',
          transition: 'box-shadow 0.3s ease',
        }}
      >
        <div className="masthead-inner">
          <div className="masthead-topbar">
            <span className="masthead-topbar-text">{today || '\u00A0'}</span>
            <span className="masthead-topbar-text">Punjab, Pakistan · Free &amp; Open Platform</span>
          </div>

          <div className="masthead-main">
            <div className="masthead-left">
              <LocationCounter />
            </div>

            <div className="masthead-center">
              <span className="masthead-kicker">Est. 2025</span>
              <span className="masthead-wordmark">The Punjab Times</span>
              <div className="masthead-rule-wrap">
                <div className="masthead-rule-line" />
                <div className="masthead-rule-diamond" />
                <div className="masthead-rule-line" />
              </div>
            </div>

            <div className="masthead-right" style={{ gap: '1rem' }}>
              <button className="masthead-publish-btn" onClick={() => setShowMetrics(true)} style={{ background: 'transparent', boxShadow: 'none', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.2)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 20V10"/>
                  <path d="M18 20V4"/>
                  <path d="M6 20v-4"/>
                </svg>
                Metrics
              </button>
              {onPublish && (
                <button className="masthead-publish-btn" onClick={onPublish}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Write Article
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main>{children}</main>

      {showMetrics && <MetricsModal onClose={() => setShowMetrics(false)} />}

      <footer style={{
        background: '#020617',
        borderTop: '3px solid #F59E0B',
        padding: '2.5rem 2rem',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div>
            <p style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '1.2rem',
              color: '#FFFFFF',
              marginBottom: '3px',
            }}>
              The Punjab Times
            </p>
            <p style={{
              fontFamily: "'Outfit', system-ui, sans-serif",
              fontSize: '0.68rem',
              color: 'rgba(255,255,255,0.28)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}>
              A voice for every district
            </p>
          </div>
          <p style={{
            fontFamily: "'Outfit', system-ui, sans-serif",
            fontSize: '0.72rem',
            color: 'rgba(255,255,255,0.2)',
          }}>
            © {new Date().getFullYear()} The Punjab Times · Articles represent the views of their authors
          </p>
        </div>
      </footer>
    </>
  );
}