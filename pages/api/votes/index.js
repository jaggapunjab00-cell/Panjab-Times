import connectDB from '../../../lib/mongodb';
import Vote from '../../../models/Vote';
import { PUNJAB_DISTRICTS } from '../../../lib/districts';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    await connectDB();

    // Aggregate counts of votes grouped by district
    const voteAgg = await Vote.aggregate([
      {
        $group: {
          _id: '$district',
          count: { $sum: 1 },
        },
      },
    ]);

    const total = await Vote.countDocuments();

    // Map through all districts to ensure a complete list, even for those with 0 votes
    const data = PUNJAB_DISTRICTS.map((districtName) => {
      const match = voteAgg.find((v) => v._id === districtName);
      const count = match ? match.count : 0;
      const percentage =
        total > 0 ? parseFloat(((count / total) * 100).toFixed(1)) : 0;
      return {
        district: districtName,
        count,
        percentage,
      };
    });

    // Sort descending by count, then alphabetically by district
    data.sort(
      (a, b) => b.count - a.count || a.district.localeCompare(b.district)
    );

    return res.status(200).json({
      success: true,
      data,
      total,
    });
  } catch (error) {
    console.error('Error in GET /api/votes:', error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
}
