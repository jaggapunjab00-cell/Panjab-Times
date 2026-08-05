import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { format, formatDistanceToNow } from 'date-fns';
import ArticleCard from '../../components/ArticleCard';

const AVATAR_COLORS = [
  '#020617','#0F172A','#2C3E6B','#4A3728',
  '#1A4A4A','#3D2B6B','#5C3317','#2D4A1E',
];

function avatarColor(name) {
  if (!name) return AVATAR_COLORS[0];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

function initials(name) {
  if (!name) return 'PT';
  return name.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() || '').join('');
}

export default function ArticleDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [article, setArticle] = useState(null);
  const [moreArticles, setMoreArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [upvoted, setUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(0);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    // Fetch primary article details
    fetch(`/api/articles/${id}`)
      .then(res => res.json())
      .then(data => {
        if (!isMounted) return;
        if (data.success && data.data) {
          setArticle(data.data);
          setUpvoteCount(data.data.views || Math.floor(Math.random() * 25) + 5);
        } else {
          setError(data.message || 'Article not found');
        }
      })
      .catch(err => {
        if (isMounted) setError('Failed to load article');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    // Fetch related articles for bottom recommendations
    fetch('/api/articles?limit=4')
      .then(res => res.json())
      .then(data => {
        if (!isMounted) return;
        if (data.success && data.data) {
          setMoreArticles(data.data.filter(a => a._id !== id).slice(0, 3));
        }
      })
      .catch(console.error);

    return () => { isMounted = false; };
  }, [id]);

  function handleShare() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  function handleUpvote() {
    if (!upvoted) {
      setUpvoted(true);
      setUpvoteCount(prev => prev + 1);
    }
  }

  if (loading) {
    return (
      <div className="page-wrap" style={{ paddingTop: '3rem', maxWidth: '860px' }}>
        <div className="skeleton" style={{ height: '24px', width: '120px', marginBottom: '2rem' }} />
        <div className="skeleton" style={{ height: '48px', width: '90%', marginBottom: '1rem' }} />
        <div className="skeleton" style={{ height: '24px', width: '60%', marginBottom: '2rem' }} />
        <div className="skeleton" style={{ height: '380px', width: '100%', borderRadius: '12px', marginBottom: '2rem' }} />
        <div className="skeleton" style={{ height: '16px', width: '100%', marginBottom: '12px' }} />
        <div className="skeleton" style={{ height: '16px', width: '95%', marginBottom: '12px' }} />
        <div className="skeleton" style={{ height: '16px', width: '80%', marginBottom: '12px' }} />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="page-wrap" style={{ paddingTop: '4rem', textAlign: 'center', maxWidth: '600px' }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%',
          background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.5rem'
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.8rem', color: '#020617', marginBottom: '0.5rem' }}>
          Article Not Found
        </h2>
        <p style={{ color: '#64748B', marginBottom: '2rem', fontSize: '0.95rem' }}>
          The article you are looking for might have been moved, deleted, or is temporarily unavailable.
        </p>
        <Link href="/" className="btn-saffron" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          Back to Punjab Times Feed
        </Link>
      </div>
    );
  }

  const { author, title, body, imageUrl, createdAt, readTime, district } = article;
  const publishedDate = createdAt ? format(new Date(createdAt), "MMMM d, yyyy 'at' h:mm a") : '';
  const timeAgo = createdAt ? formatDistanceToNow(new Date(createdAt), { addSuffix: true }) : '';
  const paragraphs = body.split(/\n+/).map(p => p.trim()).filter(Boolean);
  const bg = avatarColor(author);
  const ini = initials(author);

  return (
    <>
      <Head>
        <title>{title} — The Punjab Times</title>
        <meta name="description" content={body.slice(0, 160)} />
      </Head>

      <div className="article-page-wrap">
        {/* Top Sticky Navigation Bar */}
        <div className="article-page-nav">
          <Link href="/" className="article-back-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
            <span>Back to Stories</span>
          </Link>
          <div className="article-breadcrumbs">
            <Link href="/">Home</Link>
            <span className="crumb-sep">/</span>
            <span>{district || 'Punjab'}</span>
          </div>
        </div>

        {/* Article Container */}
        <article className="article-detail-card">
          {/* Header & Eyebrow */}
          <header className="article-header">
            <div className="article-badge-row">
              <span className="article-district-tag">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                {district || 'Punjab, Pakistan'}
              </span>
              <span className="article-read-badge">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                {readTime || 3} min read
              </span>
            </div>

            <h1 className="article-page-title">{title}</h1>

            {/* Author Byline Box */}
            <div className="article-author-box">
              <div className="author-avatar-wrap" style={{ background: bg }}>
                {ini}
              </div>
              <div className="author-info">
                <h3 className="author-name">{author}</h3>
                <p className="article-pub-meta">
                  Published {publishedDate || timeAgo}
                </p>
              </div>

              {/* Action Toolbar */}
              <div className="article-actions">
                <button
                  className={`article-action-btn ${upvoted ? 'active' : ''}`}
                  onClick={handleUpvote}
                  title="Applaud story"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill={upvoted ? "#F59E0B" : "none"} stroke={upvoted ? "#F59E0B" : "currentColor"} strokeWidth="2" strokeLinecap="round">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                  </svg>
                  <span>{upvoteCount}</span>
                </button>

                <button
                  className="article-action-btn"
                  onClick={handleShare}
                  title="Share link"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="18" cy="5" r="3"/>
                    <circle cx="6" cy="12" r="3"/>
                    <circle cx="18" cy="19" r="3"/>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                  </svg>
                  <span>{copied ? 'Copied!' : 'Share'}</span>
                </button>

                <button
                  className="article-action-btn"
                  onClick={() => window.print()}
                  title="Print article"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <polyline points="6 9 6 2 18 2 18 9"/>
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                    <rect x="6" y="14" width="12" height="8"/>
                  </svg>
                </button>
              </div>
            </div>
          </header>

          {/* Cover Hero Image */}
          {imageUrl && (
            <div className="article-cover-frame">
              <img src={imageUrl} alt={title} className="article-cover-image" />
            </div>
          )}

          {/* Article Main Text Body */}
          <div className="article-main-body">
            {paragraphs.map((p, idx) => (
              <p key={idx} className={idx === 0 ? 'first-paragraph' : ''}>
                {p}
              </p>
            ))}
          </div>

          {/* Footer Signature */}
          <footer className="article-footer-strip">
            <div className="footer-rule-line" />
            <div className="footer-brand-tag">
              <span>The Punjab Times</span>
              <span className="brand-dot">·</span>
              <span className="brand-motto">Voice of the People</span>
            </div>
            <div className="footer-rule-line" />
          </footer>
        </article>

        {/* More Stories Recommendations */}
        {moreArticles.length > 0 && (
          <section className="related-stories-section">
            <div className="section-eyebrow">
              <div className="section-eyebrow-rule-short" />
              <span className="section-eyebrow-text">More Stories From Punjab</span>
              <div className="section-eyebrow-rule" />
            </div>
            <div className="stream-grid">
              {moreArticles.map(rec => (
                <ArticleCard key={rec._id} article={rec} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
