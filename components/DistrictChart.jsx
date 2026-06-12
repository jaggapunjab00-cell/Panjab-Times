import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { district, count, percentage } = payload[0].payload;
  return (
    <div style={{ background: '#020617', border: '1px solid rgba(232,150,12,0.35)', padding: '0.45rem 0.75rem', boxShadow: '0 4px 16px rgba(0,0,0,0.3)', pointerEvents: 'none' }}>
      <p style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontSize: '0.7rem', fontWeight: 700, color: '#F59E0B', marginBottom: '1px' }}>{district}</p>
      <p style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontSize: '0.65rem', color: 'rgba(250,250,247,0.7)' }}>{count} {count === 1 ? 'vote' : 'votes'} · {percentage}%</p>
    </div>
  );
}

export default function DistrictChart({ data, userDistrict, onSelectDistrict }) {
  if (!data?.length) return (
    <p style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontSize: '0.75rem', color: '#718096', textAlign: 'center', padding: '1.25rem 0', fontStyle: 'italic' }}>No votes yet — be the first!</p>
  );

  const withVotes = data.filter(d => d.count > 0);
  const top = withVotes.slice(0, 14);
  if (userDistrict && !top.some(d => d.district === userDistrict)) {
    const ue = data.find(d => d.district === userDistrict);
    if (ue) top.push(ue);
  }
  const chart = top.length > 0 ? top : data.slice(0, 10);
  const fmt   = n => n.length > 8 ? n.slice(0, 7) + '…' : n;

  return (
    <div style={{ width: '100%', marginBottom: '0.25rem' }}>
      <ResponsiveContainer width="100%" height={170}>
        <BarChart data={chart} margin={{ top: 2, right: 2, left: -30, bottom: 38 }} barCategoryGap="30%">
          <XAxis dataKey="district" tickFormatter={fmt}
            tick={{ fontFamily: "'Outfit', system-ui, sans-serif", fontSize: 8.5, fill: '#718096', fontWeight: 500 }}
            axisLine={{ stroke: '#E4E4DF' }} tickLine={false} angle={-40} textAnchor="end" interval={0} />
          <YAxis allowDecimals={false}
            tick={{ fontFamily: "'Outfit', system-ui, sans-serif", fontSize: 8.5, fill: '#718096' }}
            axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
          <Bar dataKey="count" radius={[2, 2, 0, 0]} maxBarSize={20}>
            {chart.map(e => (
              <Cell key={e.district}
                fill={e.district === userDistrict ? '#F59E0B' : '#0F172A'}
                opacity={e.count === 0 ? 0.2 : 1}
                style={{ cursor: onSelectDistrict ? 'pointer' : 'default' }}
                onClick={() => onSelectDistrict?.(e.district)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {userDistrict && (
        <div style={{ display: 'flex', gap: '12px', paddingTop: '5px', borderTop: '1px solid #E4E4DF', marginTop: '2px' }}>
          {[['#F59E0B', 'Your district'], ['#0F172A', 'Others']].map(([c, l]) => (
            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '8px', height: '8px', background: c, flexShrink: 0 }} />
              <span style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontSize: '0.6rem', color: '#718096' }}>{l}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}