import { formatDistanceToNow, format } from 'date-fns';

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

function Avatar({ name, size = 28 }) {
  return (
    <span
      className="avatar"
      style={{
        width: size, height: size,
        background: avatarColor(name),
        fontSize: size * 0.36,
      }}
    >
      {initials(name)}
    </span>
  );
}

// ── HERO CARD ────────────────────────────────────────────
export function HeroCard({ article, onClick }) {
  const { author, title, body, imageUrl, createdAt, readTime } = article;
  const excerpt = body.length > 220 ? body.slice(0, 220).trimEnd() + '…' : body;
  const timeAgo = createdAt ? formatDistanceToNow(new Date(createdAt), { addSuffix: true }) : '';

  return (
    <article className="hero-article" onClick={onClick}
      role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick?.()}>

      {/* Image side */}
      <div className="hero-img-wrap">
        {imageUrl
          ? <img src={imageUrl} alt={title} className="hero-img" />
          : <div className="hero-img-placeholder" />
        }
      </div>

      {/* Content side */}
      <div className="hero-body">
        <div className="hero-label">
          <span className="hero-label-dot" />
          <span className="hero-label-text">Lead Story</span>
        </div>

        <h2 className="hero-title">{title}</h2>
        <p className="hero-excerpt">{excerpt}</p>

        <div className="hero-byline">
          <Avatar name={author} size={36} />
          <div style={{ flex: 1 }}>
            <p style={{
              fontFamily: "'Outfit', system-ui, sans-serif",
              fontSize: '0.82rem',
              fontWeight: 600,
              color: '#020617',
            }}>
              {author}
            </p>
            <p style={{
              fontFamily: "'Outfit', system-ui, sans-serif",
              fontSize: '0.7rem',
              color: '#718096',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <span>{timeAgo}</span>
              <span style={{ opacity: 0.4 }}>·</span>
              <span>{readTime} min read</span>
            </p>
          </div>
          <span className="card-read-more">
            Read
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </span>
        </div>
      </div>
    </article>
  );
}

// ── FEATURE CARD (medium, 2-col row) ────────────────────
export function FeatureCard({ article, onClick }) {
  const { author, title, body, imageUrl, createdAt, readTime } = article;
  const excerpt = body.length > 130 ? body.slice(0, 130).trimEnd() + '…' : body;
  const timeAgo = createdAt ? formatDistanceToNow(new Date(createdAt), { addSuffix: true }) : '';

  return (
    <article className="feature-card" onClick={onClick}
      role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick?.()}>

      <div className="feature-img-wrap">
        {imageUrl
          ? <img src={imageUrl} alt={title} className="feature-img" />
          : <div className="img-placeholder" />
        }
      </div>

      <div className="feature-body">
        <div className="card-author">
          <Avatar name={author} size={18} />
          {author}
        </div>
        <h3 className="card-title-lg">{title}</h3>
        <p className="card-excerpt">{excerpt}</p>
        <div className="card-meta">
          <span>{timeAgo} · {readTime} min read</span>
          <span className="card-read-more">
            Read
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </span>
        </div>
      </div>
    </article>
  );
}

// ── STREAM CARD (small, 3-col grid) ─────────────────────
export default function ArticleCard({ article, onClick }) {
  const { author, title, body, imageUrl, createdAt, readTime } = article;
  const excerpt = body.length > 100 ? body.slice(0, 100).trimEnd() + '…' : body;
  const timeAgo = createdAt ? formatDistanceToNow(new Date(createdAt), { addSuffix: true }) : '';

  return (
    <article className="stream-card" onClick={onClick}
      role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick?.()}>

      <div className="stream-img-wrap">
        {imageUrl
          ? <img src={imageUrl} alt={title} className="stream-img" />
          : <div className="img-placeholder" />
        }
      </div>

      <div className="stream-body">
        <div className="card-author">
          <Avatar name={author} size={16} />
          {author}
        </div>
        <h3 className="card-title-sm">{title}</h3>
        <p className="card-excerpt">{excerpt}</p>
        <div className="card-meta">
          <span>{timeAgo}</span>
          <span className="card-read-more">
            Read
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </span>
        </div>
      </div>
    </article>
  );
}