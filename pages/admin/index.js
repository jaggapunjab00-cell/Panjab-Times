import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

function DeleteConfirmModal({ article, onConfirm, onCancel, deleting }) {
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div
        className="modal-sheet"
        style={{ maxWidth: 480 }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ padding: '2.5rem' }}>
          <div style={{
            width: 56, height: 56,
            borderRadius: '50%',
            background: 'rgba(239,68,68,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6M14 11v6"/>
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--ink)', textAlign: 'center', marginBottom: '0.75rem' }}>
            Delete Article?
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--slate)', textAlign: 'center', lineHeight: 1.6, marginBottom: '0.5rem' }}>
            You are about to permanently delete:
          </p>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--ink)', textAlign: 'center', lineHeight: 1.4, marginBottom: '2rem', padding: '0 1rem' }}>
            &ldquo;{article.title}&rdquo;
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: '#EF4444', textAlign: 'center', marginBottom: '1.75rem' }}>
            This action cannot be undone.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              id="admin-delete-cancel-btn"
              onClick={onCancel}
              disabled={deleting}
              className="btn-outline"
              style={{ flex: 1, justifyContent: 'center', padding: '0.85rem' }}
            >
              Cancel
            </button>
            <button
              id="admin-delete-confirm-btn"
              onClick={onConfirm}
              disabled={deleting}
              className="admin-danger-btn"
              style={{ flex: 1 }}
            >
              {deleting ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="spin">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  Deleting…
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  </svg>
                  Yes, Delete
                </>
              )}
            </button>
          </div>
        </div>
      </div>
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

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function ArticleRow({ article, onDelete }) {
  const excerpt = article.body?.slice(0, 120) + (article.body?.length > 120 ? '…' : '');
  return (
    <div className="admin-article-row">
      {article.imageUrl ? (
        <div className="admin-article-thumb">
          <img src={article.imageUrl} alt={article.title} />
        </div>
      ) : (
        <div className="admin-article-thumb admin-article-thumb-placeholder">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(245,158,11,0.4)" strokeWidth="1.5" strokeLinecap="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
        </div>
      )}

      <div className="admin-article-info">
        <h3 className="admin-article-title">{article.title}</h3>
        <p className="admin-article-excerpt">{excerpt}</p>
        <div className="admin-article-meta">
          <span className="admin-article-author">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            {article.author}
          </span>
          <span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            {formatDate(article.publishedAt)}
          </span>
          <span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
            </svg>
            {article.reads || 0} reads
          </span>
          <span>{article.readTime || 1} min read</span>
        </div>
      </div>

      <button
        id={`admin-delete-${article._id}`}
        onClick={() => onDelete(article)}
        className="admin-row-delete-btn"
        title="Delete article"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
          <path d="M10 11v6M14 11v6"/>
          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
        </svg>
        Delete
      </button>
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch all articles (large limit)
      const res = await fetch('/api/articles?page=1&limit=500');
      const data = await res.json();
      if (data.success) {
        setArticles(data.data);
      }
    } catch {
      setToast({ message: 'Failed to load articles.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchArticles(); }, [fetchArticles]);

  async function handleDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/articles/${toDelete._id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.status === 401) {
        // Session expired
        router.push('/admin/login');
        return;
      }
      if (data.success) {
        setArticles(prev => prev.filter(a => a._id !== toDelete._id));
        setToast({ message: `"${toDelete.title}" deleted successfully.`, type: 'success' });
        setToDelete(null);
      } else {
        setToast({ message: data.message || 'Delete failed.', type: 'error' });
      }
    } catch {
      setToast({ message: 'Connection error. Please try again.', type: 'error' });
    } finally {
      setDeleting(false);
    }
  }

  async function handleLogout() {
    setLoggingOut(true);
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  const filtered = articles.filter(a =>
    a.title?.toLowerCase().includes(search.toLowerCase()) ||
    a.author?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Head>
        <title>Admin — The Punjab Times</title>
      </Head>

      {/* Admin topbar */}
      <div className="admin-topbar">
        <div className="admin-topbar-inner">
          <div className="admin-topbar-brand">
            <div className="admin-topbar-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div>
              <span className="admin-topbar-eyebrow">The Punjab Times</span>
              <span className="admin-topbar-title">Admin Dashboard</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <a href="/" className="admin-visit-btn" target="_blank" rel="noopener noreferrer">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              Visit Site
            </a>
            <button
              id="admin-logout-btn"
              onClick={handleLogout}
              disabled={loggingOut}
              className="admin-logout-btn"
            >
              {loggingOut ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="spin">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              )}
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="admin-page">
        {/* Stats bar */}
        <div className="admin-stats-bar">
          <div className="admin-stat-card">
            <span className="admin-stat-num">{articles.length}</span>
            <span className="admin-stat-label">Total Articles</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-num">{articles.reduce((s, a) => s + (a.reads || 0), 0).toLocaleString()}</span>
            <span className="admin-stat-label">Total Reads</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-num">{articles.filter(a => a.imageUrl).length}</span>
            <span className="admin-stat-label">With Images</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-num">{[...new Set(articles.map(a => a.author))].length}</span>
            <span className="admin-stat-label">Contributors</span>
          </div>
        </div>

        {/* Articles section */}
        <div className="admin-section">
          <div className="admin-section-header">
            <div>
              <h2 className="admin-section-title">All Articles</h2>
              <p className="admin-section-sub">
                {loading ? 'Loading…' : `${filtered.length} article${filtered.length !== 1 ? 's' : ''} ${search ? 'matched' : 'total'}`}
              </p>
            </div>
            <div className="admin-search-wrap">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="admin-search-icon">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                id="admin-search-input"
                type="text"
                placeholder="Search by title or author…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="admin-search-input"
              />
              {search && (
                <button className="admin-search-clear" onClick={() => setSearch('')} aria-label="Clear search">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="admin-loading">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" className="spin">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              <span>Loading articles…</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="admin-empty">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(15,23,42,0.2)" strokeWidth="1.5" strokeLinecap="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              <p>{search ? 'No articles matched your search.' : 'No articles published yet.'}</p>
            </div>
          ) : (
            <div className="admin-articles-list">
              {filtered.map(article => (
                <ArticleRow key={article._id} article={article} onDelete={setToDelete} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete confirm modal */}
      {toDelete && (
        <DeleteConfirmModal
          article={toDelete}
          onConfirm={handleDelete}
          onCancel={() => !deleting && setToDelete(null)}
          deleting={deleting}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}
    </>
  );
}
