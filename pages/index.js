import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import ArticleCard, { HeroCard, FeatureCard } from '../components/ArticleCard';
import ArticleModal from '../components/ArticleModal';
import PublishModal from '../components/PublishModal';

function SkeletonHero() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#fff', marginBottom: '3px' }}>
      <div className="skeleton" style={{ minHeight: '380px' }} />
      <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="skeleton" style={{ height: '10px', width: '80px' }} />
        <div className="skeleton" style={{ height: '32px', width: '90%' }} />
        <div className="skeleton" style={{ height: '32px', width: '75%' }} />
        <div className="skeleton" style={{ height: '14px', width: '100%' }} />
        <div className="skeleton" style={{ height: '14px', width: '88%' }} />
        <div className="skeleton" style={{ height: '14px', width: '70%' }} />
        <div style={{ marginTop: 'auto', paddingTop: '1.25rem', borderTop: '1px solid #E4E4DF', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div className="skeleton" style={{ width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div className="skeleton" style={{ height: '11px', width: '100px', marginBottom: '5px' }} />
            <div className="skeleton" style={{ height: '10px', width: '80px' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function SkeletonFeature() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px', marginBottom: '3px' }}>
      {[0,1].map(i => (
        <div key={i} style={{ background: '#fff' }}>
          <div className="skeleton" style={{ aspectRatio: '3/2' }} />
          <div style={{ padding: '1.4rem 1.6rem' }}>
            <div className="skeleton" style={{ height: '10px', width: '70px', marginBottom: '10px' }} />
            <div className="skeleton" style={{ height: '18px', width: '95%', marginBottom: '6px' }} />
            <div className="skeleton" style={{ height: '18px', width: '80%', marginBottom: '14px' }} />
            <div className="skeleton" style={{ height: '11px', width: '100%', marginBottom: '5px' }} />
            <div className="skeleton" style={{ height: '11px', width: '65%' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function SkeletonStream() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3px' }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} style={{ background: '#fff' }}>
          <div className="skeleton" style={{ aspectRatio: '4/3' }} />
          <div style={{ padding: '1.1rem 1.25rem' }}>
            <div className="skeleton" style={{ height: '9px', width: '60px', marginBottom: '8px' }} />
            <div className="skeleton" style={{ height: '16px', width: '90%', marginBottom: '5px' }} />
            <div className="skeleton" style={{ height: '16px', width: '75%', marginBottom: '12px' }} />
            <div className="skeleton" style={{ height: '11px', width: '100%', marginBottom: '4px' }} />
            <div className="skeleton" style={{ height: '11px', width: '55%' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ onPublish }) {
  return (
    <div style={{ textAlign: 'center', padding: '6rem 2rem', background: '#fff' }}>
      <div style={{ width: '64px', height: '64px', background: 'rgba(27,58,45,0.06)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" style={{ opacity: 0.5 }}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="12" y1="18" x2="12" y2="12"/>
          <line x1="9" y1="15" x2="15" y2="15"/>
        </svg>
      </div>
      <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.5rem', color: '#020617', marginBottom: '0.5rem' }}>No articles yet</h3>
      <p style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontSize: '0.9rem', color: '#718096', marginBottom: '1.75rem', maxWidth: '300px', margin: '0 auto 1.75rem', lineHeight: 1.65 }}>
        The Punjab Times is waiting for its first story. Be the voice that starts the conversation.
      </p>
      <button className="btn-saffron" onClick={onPublish} style={{ margin: '0 auto' }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Write the first article
      </button>
    </div>
  );
}

function Toast({ message, type = 'success', onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 4000); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className={`toast ${type === 'error' ? 'error' : ''}`}>
      {type === 'error' ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
      )}
      {message}
    </div>
  );
}

// ── MAIN PAGE ────────────────────────────────────────────
export default function Home({ globalShowPublish, setGlobalShowPublish }) {
  const [articles,      setArticles]      = useState([]);
  const [pagination,    setPagination]    = useState(null);
  const [pageLoading,   setPageLoading]   = useState(true);
  const [moreLoading,   setMoreLoading]   = useState(false);
  const [currentPage,   setCurrentPage]   = useState(1);
  const [activeArticle, setActiveArticle] = useState(null);
  const [showPublish,   setShowPublish]   = useState(false);
  const [toast,         setToast]         = useState(null);

  // Sync global publish trigger from Layout's Write Article button
  useEffect(() => {
    if (globalShowPublish) { setShowPublish(true); setGlobalShowPublish?.(false); }
  }, [globalShowPublish, setGlobalShowPublish]);

  const fetchArticles = useCallback(async (page = 1, append = false) => {
    try {
      if (page === 1) setPageLoading(true);
      else            setMoreLoading(true);
      const res  = await fetch(`/api/articles?page=${page}&limit=15`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to load stories');
      setArticles(prev => append ? [...prev, ...data.data] : data.data);
      setPagination(data.pagination);
      setCurrentPage(page);
    } catch (e) { 
      console.error(e); 
      setToast({ message: 'Unable to connect to the feed. Please try again.', type: 'error' });
    }
    finally { setPageLoading(false); setMoreLoading(false); }
  }, []);

  useEffect(() => { fetchArticles(1); }, [fetchArticles]);

  const handlePublished = useCallback((article) => {
    setArticles(prev => [article, ...prev]);
    setPagination(prev => prev ? { ...prev, total: prev.total + 1 } : prev);
    setToast({ message: `"${article.title}" published!`, type: 'success' });
  }, []);

  // Layout: hero(0), feature(1,2), stream(3+)
  const hero    = articles[0]    || null;
  const feature = articles.slice(1, 3);
  const stream  = articles.slice(3);

  return (
    <>
      <Head>
        <title>The Punjab Times — Stories from the Heart of Punjab</title>
      </Head>

      <div className="page-wrap" style={{ paddingTop: '2.5rem' }}>

        {/* ── Live strip ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#16a34a', display: 'inline-block', animation: 'blink 2.5s ease-in-out infinite', flexShrink: 0 }} />
          <span style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#020617' }}>Live Feed</span>
          <span style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontSize: '0.68rem', color: '#718096' }}>— articles published by readers across Punjab</span>
          {pagination?.total > 0 && !pageLoading && (
            <span style={{ marginLeft: 'auto', fontFamily: "'Outfit', system-ui, sans-serif", fontSize: '0.68rem', color: '#718096' }}>
              {pagination.total} {pagination.total === 1 ? 'article' : 'articles'}
            </span>
          )}
          <style>{`@keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0.3;} }`}</style>
        </div>

        {/* ── Section eyebrow ── */}
        <div className="section-eyebrow">
          <div className="section-eyebrow-rule-short" />
          <span className="section-eyebrow-text">From Every Corner of Punjab</span>
          <div className="section-eyebrow-rule" />
        </div>

        {/* ── Loading skeletons ── */}
        {pageLoading && (
          <>
            <SkeletonHero />
            <SkeletonFeature />
            <SkeletonStream />
          </>
        )}

        {/* ── Empty state ── */}
        {!pageLoading && articles.length === 0 && (
          <EmptyState onPublish={() => setShowPublish(true)} />
        )}

        {/* ── Editorial grid ── */}
        {!pageLoading && articles.length > 0 && (
          <>
            {/* Hero */}
            {hero && (
              <HeroCard article={hero} onClick={() => setActiveArticle(hero)} />
            )}

            {/* Feature row */}
            {feature.length > 0 && (
              <div className="feature-grid">
                {feature.map(a => (
                  <FeatureCard key={a._id} article={a} onClick={() => setActiveArticle(a)} />
                ))}
              </div>
            )}

            {/* Stream */}
            {stream.length > 0 && (
              <>
                {stream.length >= 3 && (
                  <div style={{ margin: '2rem 0 1.25rem' }}>
                    <div className="section-eyebrow">
                      <div className="section-eyebrow-rule-short" />
                      <span className="section-eyebrow-text">More Stories</span>
                      <div className="section-eyebrow-rule" />
                    </div>
                  </div>
                )}
                <div className="stream-grid">
                  {stream.map(a => (
                    <ArticleCard key={a._id} article={a} onClick={() => setActiveArticle(a)} />
                  ))}
                </div>
              </>
            )}

            {/* Load more */}
            {pagination?.hasMore && (
              <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                <button
                  onClick={() => fetchArticles(currentPage + 1, true)}
                  disabled={moreLoading}
                  className="btn-outline"
                  style={{ padding: '0.85rem 2.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.75rem' }}
                >
                  {moreLoading
                    ? <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Loading…</>
                    : 'Load more stories'
                  }
                </button>
                <p style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontSize: '0.7rem', color: '#718096', marginTop: '0.65rem' }}>
                  Showing {articles.length} of {pagination.total}
                </p>
              </div>
            )}

            {!pagination?.hasMore && articles.length > 12 && (
              <div style={{ textAlign: 'center', padding: '2rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                <div style={{ width: '48px', height: '1px', background: '#E4E4DF' }} />
                <span style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#718096' }}>
                  All {pagination.total} articles
                </span>
                <div style={{ width: '48px', height: '1px', background: '#E4E4DF' }} />
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {activeArticle && <ArticleModal article={activeArticle} onClose={() => setActiveArticle(null)} />}
      {showPublish   && <PublishModal onClose={() => setShowPublish(false)} onPublished={handlePublished} />}

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}
    </>
  );
}