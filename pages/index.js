import { useState, useEffect, useCallback, useMemo } from 'react';
import Head from 'next/head';
import ArticleCard, { HeroCard, FeatureCard } from '../components/ArticleCard';
import PublishModal from '../components/PublishModal';

function SkeletonHero() {
  return (
    <div className="hero-article-skeleton">
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
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
      {[0, 1].map(i => (
        <div key={i} style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
          <div className="skeleton" style={{ aspectRatio: '16/9' }} />
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
    <div className="stream-grid">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
          <div className="skeleton" style={{ aspectRatio: '16/9' }} />
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

function EmptyState({ onPublish, searchQuery, onClearSearch }) {
  return (
    <div style={{ textAlign: 'center', padding: '5rem 2rem', background: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
      <div style={{ width: '64px', height: '64px', background: 'rgba(245,158,11,0.1)', color: '#F59E0B', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </div>
      <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.6rem', color: '#020617', marginBottom: '0.5rem' }}>
        {searchQuery ? `No stories matching "${searchQuery}"` : 'No stories published yet'}
      </h3>
      <p style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontSize: '0.92rem', color: '#64748B', maxWidth: '380px', margin: '0 auto 1.75rem', lineHeight: 1.6 }}>
        {searchQuery
          ? 'Try checking for spelling errors or searching for different keywords.'
          : 'Be the first journalist or citizen reporter to publish news on The Punjab Times.'}
      </p>

      {searchQuery ? (
        <button className="btn-outline" onClick={onClearSearch} style={{ margin: '0 auto', padding: '0.75rem 1.75rem' }}>
          Clear search query
        </button>
      ) : (
        <button className="btn-saffron" onClick={onPublish} style={{ margin: '0 auto' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Write the first article
        </button>
      )}
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

export default function Home({ globalShowPublish, setGlobalShowPublish }) {
  const [articles,     setArticles]     = useState([]);
  const [pagination,   setPagination]   = useState(null);
  const [pageLoading,  setPageLoading]  = useState(true);
  const [moreLoading,  setMoreLoading]  = useState(false);
  const [currentPage,  setCurrentPage]  = useState(1);
  const [showPublish,  setShowPublish]  = useState(false);
  const [searchQuery,  setSearchQuery]  = useState('');
  const [toast,        setToast]        = useState(null);

  // Sync global publish trigger from Layout's Write Article button
  useEffect(() => {
    if (globalShowPublish) { setShowPublish(true); setGlobalShowPublish?.(false); }
  }, [globalShowPublish, setGlobalShowPublish]);

  const fetchArticles = useCallback(async (page = 1, append = false) => {
    try {
      if (page === 1) setPageLoading(true);
      else            setMoreLoading(true);
      const res  = await fetch(`/api/articles?page=${page}&limit=20`);
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

  // Filter articles by search query on title
  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return articles;
    const q = searchQuery.toLowerCase().trim();
    return articles.filter(a => (a.title || '').toLowerCase().includes(q));
  }, [articles, searchQuery]);

  // Editorial breakdown: hero (0), feature (1,2), stream (3+)
  const hero    = filteredArticles[0]    || null;
  const feature = filteredArticles.slice(1, 3);
  const stream  = filteredArticles.slice(3);

  return (
    <>
      <Head>
        <title>The Punjab Times — Stories from the Heart of Punjab</title>
      </Head>

      <div className="page-wrap" style={{ paddingTop: '2.5rem' }}>

        {/* ── Header Live Feed Strip ── */}
        <div className="feed-header-strip">
          <div className="live-pulse-group">
            <span className="pulse-dot" />
            <span className="feed-strip-title">LIVE PUNJAB FEED</span>
            <span className="feed-strip-subtitle">— News and reports directly from readers across Punjab</span>
          </div>
          {pagination?.total > 0 && !pageLoading && (
            <div className="feed-count-badge">
              <span>{pagination.total} {pagination.total === 1 ? 'Story' : 'Stories'}</span>
            </div>
          )}
        </div>

        {/* ── Title Search Input Bar ── */}
        <div className="title-search-bar">
          <div className="search-input-wrap">
            <span className="search-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </span>
            <input
              type="text"
              className="title-search-input"
              placeholder="Search stories by title..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
          </div>

          {searchQuery && (
            <div className="search-results-tag">
              Showing {filteredArticles.length} {filteredArticles.length === 1 ? 'result' : 'results'} for &ldquo;{searchQuery}&rdquo;
            </div>
          )}
        </div>

        {/* ── Section eyebrow ── */}
        <div className="section-eyebrow">
          <div className="section-eyebrow-rule-short" />
          <span className="section-eyebrow-text">
            {searchQuery ? `Search Results (${filteredArticles.length})` : 'Lead & Top Stories'}
          </span>
          <div className="section-eyebrow-rule" />
        </div>

        {/* ── Loading Skeletons ── */}
        {pageLoading && (
          <>
            <SkeletonHero />
            <SkeletonFeature />
            <SkeletonStream />
          </>
        )}

        {/* ── Empty State ── */}
        {!pageLoading && filteredArticles.length === 0 && (
          <EmptyState
            onPublish={() => setShowPublish(true)}
            searchQuery={searchQuery}
            onClearSearch={() => setSearchQuery('')}
          />
        )}

        {/* ── Main Editorial Feed ── */}
        {!pageLoading && filteredArticles.length > 0 && (
          <>
            {/* Hero Lead Story */}
            {hero && (
              <HeroCard article={hero} />
            )}

            {/* Feature Row */}
            {feature.length > 0 && (
              <div className="feature-grid">
                {feature.map(a => (
                  <FeatureCard key={a._id} article={a} />
                ))}
              </div>
            )}

            {/* Stream Row */}
            {stream.length > 0 && (
              <>
                <div style={{ margin: '2.5rem 0 1.25rem' }}>
                  <div className="section-eyebrow">
                    <div className="section-eyebrow-rule-short" />
                    <span className="section-eyebrow-text">Explore More Punjab Stories</span>
                    <div className="section-eyebrow-rule" />
                  </div>
                </div>
                <div className="stream-grid">
                  {stream.map(a => (
                    <ArticleCard key={a._id} article={a} />
                  ))}
                </div>
              </>
            )}

            {/* Load More Button */}
            {pagination?.hasMore && !searchQuery && (
              <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                <button
                  onClick={() => fetchArticles(currentPage + 1, true)}
                  disabled={moreLoading}
                  className="btn-outline"
                  style={{ padding: '0.9rem 2.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.75rem' }}
                >
                  {moreLoading
                    ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Loading stories…</>
                    : 'Load More Punjab Stories'
                  }
                </button>
                <p style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontSize: '0.72rem', color: '#718096', marginTop: '0.65rem' }}>
                  Displaying {articles.length} of {pagination.total} articles
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Publish Article Modal */}
      {showPublish && <PublishModal onClose={() => setShowPublish(false)} onPublished={handlePublished} />}

      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}
    </>
  );
}