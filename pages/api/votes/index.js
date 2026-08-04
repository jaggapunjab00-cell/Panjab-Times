import connectDB from '../../../lib/mongodb';
import Vote from '../../../models/Vote';
import { PUNJAB_DISTRICTS } from '../../../lib/districts';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    await connectDB();

    // Aggregate vote counts grouped by district
    const voteCounts = await Vote.aggregate([
      {
        $group: {
          _id:   '$district',
          count: { $sum: 1 },
        },
      },
    ]);

    // Build a full map so every district appears (even with 0 votes)
    const countMap = {};
    PUNJAB_DISTRICTS.forEach((d) => (countMap[d] = 0));
    voteCounts.forEach(({ _id, count }) => {
      if (_id) countMap[_id] = count;
    });

    const total = Object.values(countMap).reduce((a, b) => a + b, 0);

    // Shape for the chart: sorted by count descending
    const data = Object.entries(countMap)
      .map(([district, count]) => ({
        district,
        count,
        percentage: total > 0 ? ((count / total) * 100).toFixed(1) : '0.0',
      }))
      .sort((a, b) => b.count - a.count);

    res.status(200).json({ success: true, data, total });
  } catch (error) {
    console.error('GET /api/votes error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch votes' });
  }
}