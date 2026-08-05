import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

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

// ── HERO CARD (Large Lead Story) ─────────────────────────
export function HeroCard({ article }) {
  if (!article) return null;
  const { _id, author, title, body, imageUrl, createdAt, readTime, district } = article;
  const excerptLen = imageUrl ? 200 : 500;
  const excerpt = body ? (body.length > excerptLen ? body.slice(0, excerptLen).trimEnd() + '…' : body) : '';
  const timeAgo = createdAt ? formatDistanceToNow(new Date(createdAt), { addSuffix: true }) : '';

  return (
    <Link href={`/article/${_id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <article className={`hero-article ${!imageUrl ? 'no-image' : ''}`}>
        {/* Image Side */}
        {imageUrl && (
          <div className="hero-img-wrap">
            <img src={imageUrl} alt={title} className="hero-img" />
            <span className="card-district-pill">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              {district || 'Punjab'}
            </span>
          </div>
        )}

        {/* Content Side */}
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
              <p className="byline-author-name">{author}</p>
              <p className="byline-meta-info">
                <span>{timeAgo}</span>
                <span style={{ opacity: 0.4 }}>·</span>
                <span>{readTime || 3} min read</span>
              </p>
            </div>
            <span className="card-read-more">
              Read Story
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

// ── FEATURE CARD (Medium, 2-col row) ────────────────────
export function FeatureCard({ article }) {
  if (!article) return null;
  const { _id, author, title, body, imageUrl, createdAt, readTime, district } = article;
  const excerptLen = imageUrl ? 120 : 240;
  const excerpt = body ? (body.length > excerptLen ? body.slice(0, excerptLen).trimEnd() + '…' : body) : '';
  const timeAgo = createdAt ? formatDistanceToNow(new Date(createdAt), { addSuffix: true }) : '';

  return (
    <Link href={`/article/${_id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <article className={`feature-card ${!imageUrl ? 'no-image' : ''}`}>
        {imageUrl && (
          <div className="feature-img-wrap">
            <img src={imageUrl} alt={title} className="feature-img" />
            {district && (
              <span className="card-district-pill">
                {district}
              </span>
            )}
          </div>
        )}

        <div className="feature-body">
          <div className="card-author">
            <Avatar name={author} size={20} />
            <span>{author}</span>
          </div>
          <h3 className="card-title-lg">{title}</h3>
          <p className="card-excerpt">{excerpt}</p>
          <div className="card-meta">
            <span>{timeAgo} · {readTime || 3} min read</span>
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
    </Link>
  );
}

// ── STREAM CARD (Small Grid Item) ────────────────────────
export default function ArticleCard({ article }) {
  if (!article) return null;
  const { _id, author, title, body, imageUrl, createdAt, readTime, district } = article;
  const excerptLen = imageUrl ? 90 : 180;
  const excerpt = body ? (body.length > excerptLen ? body.slice(0, excerptLen).trimEnd() + '…' : body) : '';
  const timeAgo = createdAt ? formatDistanceToNow(new Date(createdAt), { addSuffix: true }) : '';

  return (
    <Link href={`/article/${_id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <article className={`stream-card ${!imageUrl ? 'no-image' : ''}`}>
        {imageUrl && (
          <div className="stream-img-wrap">
            <img src={imageUrl} alt={title} className="stream-img" />
            {district && (
              <span className="card-district-pill sm">
                {district}
              </span>
            )}
          </div>
        )}

        <div className="stream-body">
          <div className="card-author">
            <Avatar name={author} size={18} />
            <span>{author}</span>
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
    </Link>
  );
}