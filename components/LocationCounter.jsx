import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import DistrictChart from './DistrictChart';
import { PUNJAB_DISTRICTS } from '../lib/districts';

const TOKEN_KEY    = 'pt_voter_token';
const DISTRICT_KEY = 'pt_voted_district';
const OPEN_KEY     = 'pt_widget_open';

export default function LocationCounter() {
  const [open,          setOpen]          = useState(false);
  const [voteData,      setVoteData]      = useState([]);
  const [total,         setTotal]         = useState(0);
  const [token,         setToken]         = useState(null);
  const [voted,         setVoted]         = useState(null);
  const [selected,      setSelected]      = useState('');
  const [search,        setSearch]        = useState('');
  const [loading,       setLoading]       = useState(false);
  const [fetchLoading,  setFetchLoading]  = useState(true);
  const [error,         setError]         = useState('');
  const [success,       setSuccess]       = useState('');

  useEffect(() => {
    let t = localStorage.getItem(TOKEN_KEY);
    if (!t) { t = uuidv4(); localStorage.setItem(TOKEN_KEY, t); }
    setToken(t);
    const d = localStorage.getItem(DISTRICT_KEY);
    if (d) { setVoted(d); setSelected(d); }
    setOpen(localStorage.getItem(OPEN_KEY) === 'true');
  }, []);

  const fetchVotes = useCallback(async () => {
    try {
      setFetchLoading(true);
      const res  = await fetch('/api/votes');
      const data = await res.json();
      if (data.success) { setVoteData(data.data); setTotal(data.total); }
    } catch (e) { console.error(e); }
    finally { setFetchLoading(false); }
  }, []);

  useEffect(() => { fetchVotes(); }, [fetchVotes]);
  useEffect(() => { if (open) fetchVotes(); }, [open, fetchVotes]);

  const toggle = () => setOpen(p => {
    localStorage.setItem(OPEN_KEY, String(!p)); return !p;
  });

  const handleVote = async () => {
    if (!selected) { setError('Select your district first.'); return; }
    setError(''); setLoading(true);
    try {
      const res  = await fetch('/api/votes/cast', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ district: selected, voterToken: token }),
      });
      const data = await res.json();
      if (res.status === 409 || data.alreadyVoted) {
        const d = data.district || selected;
        setVoted(d); setSelected(d);
        localStorage.setItem(DISTRICT_KEY, d);
        setSuccess(`You already voted for ${d}.`);
        await fetchVotes(); return;
      }
      if (!res.ok) { setError(data.message || 'Vote failed.'); return; }
      setVoted(selected);
      localStorage.setItem(DISTRICT_KEY, selected);
      setVoteData(data.data); setTotal(data.total);
      setSuccess(`Voted for ${selected}!`);
    } catch { setError('Network error.'); }
    finally { setLoading(false); }
  };

  const filtered  = PUNJAB_DISTRICTS.filter(d => d.toLowerCase().includes(search.toLowerCase()));
  const topD      = voteData[0]?.count > 0 ? voteData[0] : null;

  return (
    <div className="loc-widget">
      {/* Header */}
      <div className="loc-header" onClick={toggle} role="button" tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && toggle()} aria-expanded={open}>
        <div className="loc-header-label">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          Punjab Districts
          {total > 0 && (
            <span style={{
              background: 'rgba(232,150,12,0.2)', border: '1px solid rgba(232,150,12,0.4)',
              borderRadius: '99px', padding: '1px 7px', fontSize: '0.6rem',
              color: '#F59E0B', fontWeight: 700,
            }}>{total.toLocaleString()}</span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.4)' }}>
          {voted && !open && (
            <span style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontSize: '0.6rem', color: '#F59E0B', opacity: 0.8, maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {voted}
            </span>
          )}
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
            style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s ease' }}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </div>

      {/* Body */}
      {open && (
        <div className="loc-body">

          {/* Top district */}
          {topD && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: '#FAFAF7', border: '1px solid #E4E4DF',
              padding: '0.55rem 0.75rem', marginBottom: '0.85rem',
            }}>
              <div>
                <p style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#718096', marginBottom: '1px' }}>Leading</p>
                <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '0.92rem', color: '#020617' }}>{topD.district}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', lineHeight: 1 }}>{topD.count}</p>
                <p style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontSize: '0.6rem', color: '#718096' }}>{topD.percentage}%</p>
              </div>
            </div>
          )}

          {/* Chart */}
          {fetchLoading
            ? <div className="skeleton" style={{ height: '170px', marginBottom: '0.85rem' }} />
            : <><p style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#718096', paddingBottom: '0.4rem', borderBottom: '1px solid #E4E4DF', marginBottom: '0.7rem' }}>Vote Distribution</p>
               <DistrictChart 
                 data={voteData} 
                 userDistrict={voted || selected} 
                 onSelectDistrict={(districtName) => {
                   if (!voted) {
                     setSelected(districtName);
                     setError('');
                   }
                 }} /></>
          }

          <div style={{ height: '1px', background: '#E4E4DF', margin: '0.85rem 0' }} />

          {/* Voted state */}
          {voted ? (
            <div>
              <p style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#718096', marginBottom: '0.55rem' }}>Your Vote</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(27,58,45,0.05)', border: '1px solid rgba(27,58,45,0.12)', padding: '0.6rem 0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F59E0B' }} />
                  <span style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontSize: '0.82rem', fontWeight: 600, color: '#020617' }}>{voted}</span>
                </div>
                <span style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontSize: '0.65rem', fontWeight: 600, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Voted
                </span>
              </div>
              {success && <p style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontSize: '0.68rem', color: '#16a34a', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                {success}
              </p>}
              {(() => {
                const e = voteData.find(d => d.district === voted);
                if (!e || total === 0) return null;
                return <p style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontSize: '0.67rem', color: '#718096', marginTop: '4px' }}>{e.count} {e.count === 1 ? 'person' : 'people'} from {voted} · {e.percentage}% of voters</p>;
              })()}
            </div>
          ) : (
            /* Voting form */
            <div>
              <p style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#718096', marginBottom: '0.55rem' }}>Where Are You From?</p>

              {error && <p style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontSize: '0.7rem', color: '#dc2626', marginBottom: '0.45rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </p>}

              {/* Search */}
              <div style={{ position: 'relative', marginBottom: '0.5rem' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#718096" strokeWidth="2" strokeLinecap="round"
                  style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input type="text" placeholder="Search district…" value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ width: '100%', padding: '0.42rem 0.7rem 0.42rem 1.8rem', background: '#FAFAF7', border: '1.5px solid #E4E4DF', fontFamily: "'Outfit', system-ui, sans-serif", fontSize: '0.78rem', color: '#020617', outline: 'none', transition: 'border-color 0.15s' }}
                  onFocus={e => e.target.style.borderColor = '#0F172A'}
                  onBlur={e  => e.target.style.borderColor = '#E4E4DF'} />
              </div>

              {/* List */}
              <div style={{ maxHeight: '145px', overflowY: 'auto', border: '1px solid #E4E4DF', marginBottom: '0.7rem' }}>
                {filtered.length === 0
                  ? <p style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontSize: '0.72rem', color: '#718096', padding: '0.75rem', textAlign: 'center', fontStyle: 'italic' }}>No match for "{search}"</p>
                  : filtered.map(d => {
                    const isSel = selected === d;
                    const cnt   = voteData.find(v => v.district === d)?.count || 0;
                    return (
                      <button key={d} onClick={() => { setSelected(d); setError(''); }}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0.4rem 0.7rem', background: isSel ? 'rgba(27,58,45,0.07)' : 'transparent', border: 'none', borderBottom: '1px solid #E4E4DF', cursor: 'pointer', textAlign: 'left', transition: 'background 0.1s' }}
                        onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = 'rgba(0,0,0,0.03)'; }}
                        onMouseLeave={e => { if (!isSel) e.currentTarget.style.background = 'transparent'; }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                          <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: isSel ? '#F59E0B' : '#E4E4DF', transition: 'background 0.1s', flexShrink: 0 }} />
                          <span style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontSize: '0.78rem', fontWeight: isSel ? 600 : 400, color: isSel ? '#0F172A' : '#020617' }}>{d}</span>
                        </div>
                        {cnt > 0 && (
                          <span style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontSize: '0.6rem', fontWeight: 600, color: isSel ? '#F59E0B' : '#718096', background: isSel ? 'rgba(232,150,12,0.1)' : '#FAFAF7', border: '1px solid', borderColor: isSel ? 'rgba(232,150,12,0.3)' : '#E4E4DF', borderRadius: '99px', padding: '1px 6px' }}>{cnt}</span>
                        )}
                      </button>
                    );
                  })
                }
              </div>

              <button onClick={handleVote} disabled={loading || !selected}
                style={{ width: '100%', padding: '0.58rem', background: selected ? '#020617' : '#E4E4DF', color: selected ? '#FAFAF7' : '#718096', border: 'none', fontFamily: "'Outfit', system-ui, sans-serif", fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.04em', cursor: selected && !loading ? 'pointer' : 'not-allowed', transition: 'background 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                onMouseEnter={e => { if (selected && !loading) e.currentTarget.style.background = '#1A1A1A'; }}
                onMouseLeave={e => { if (selected && !loading) e.currentTarget.style.background = selected ? '#020617' : '#E4E4DF'; }}>
                {loading
                  ? <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Casting…</>
                  : selected ? `Vote for ${selected}` : 'Select a district'
                }
              </button>
              <p style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontSize: '0.6rem', color: '#718096', textAlign: 'center', marginTop: '0.45rem' }}>One vote per browser · No personal data stored</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}