import connectDB from '../../../lib/mongodb';
import Vote from '../../../models/Vote';
import { PUNJAB_DISTRICTS } from '../../../models/Vote';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { district, voterToken } = req.body;

  // Validate district
  if (!district || !PUNJAB_DISTRICTS.includes(district)) {
    return res.status(400).json({
      success: false,
      message: 'Please select a valid Punjab district.',
    });
  }

  // Validate token (UUID v4 format)
  if (
    !voterToken ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      voterToken
    )
  ) {
    return res.status(400).json({
      success: false,
      message: 'Invalid voter token.',
    });
  }

  try {
    await connectDB();

    // Check if this token has already voted
    const existing = await Vote.findOne({ voterToken });

    if (existing) {
      return res.status(409).json({
        success: false,
        alreadyVoted: true,
        district: existing.district,
        message: `You have already voted for ${existing.district}.`,
      });
    }

    // Record the vote
    await Vote.create({ district, voterToken });

    // Return fresh totals so the chart updates immediately
    const voteCounts = await Vote.aggregate([
      { $group: { _id: '$district', count: { $sum: 1 } } },
    ]);

    const countMap = {};
    PUNJAB_DISTRICTS.forEach((d) => (countMap[d] = 0));
    voteCounts.forEach(({ _id, count }) => {
      if (_id) countMap[_id] = count;
    });

    const total = Object.values(countMap).reduce((a, b) => a + b, 0);

    const data = Object.entries(countMap)
      .map(([d, count]) => ({
        district: d,
        count,
        percentage: total > 0 ? ((count / total) * 100).toFixed(1) : '0.0',
      }))
      .sort((a, b) => b.count - a.count);

    res.status(201).json({
      success: true,
      message: `Vote recorded for ${district}!`,
      data,
      total,
    });
  } catch (error) {
    // Duplicate key = race condition on unique voterToken
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        alreadyVoted: true,
        message: 'You have already cast your vote.',
      });
    }
    console.error('POST /api/votes/cast error:', error);
    res.status(500).json({ success: false, message: 'Failed to record vote' });
  }
}