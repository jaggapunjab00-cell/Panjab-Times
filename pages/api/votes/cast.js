import connectDB from '../../../lib/mongodb';
import Vote from '../../../models/Vote';
import { PUNJAB_DISTRICTS } from '../../../lib/districts';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { district, voterToken } = req.body;

  if (!district || !voterToken) {
    return res.status(400).json({ success: false, message: 'District and voter token are required' });
  }

  if (!PUNJAB_DISTRICTS.includes(district)) {
    return res.status(400).json({ success: false, message: 'Invalid district' });
  }

  try {
    await connectDB();

    // Check if voter has already voted
    const existingVote = await Vote.findOne({ voterToken });

    if (existingVote) {
      return res.status(409).json({
        success: false,
        alreadyVoted: true,
        district: existingVote.district,
        message: `You have already voted for ${existingVote.district}`,
      });
    }

    // Cast the new vote
    const newVote = new Vote({
      district,
      voterToken,
    });

    await newVote.save();

    // After casting, aggregate the results to return updated stats to client
    const voteAgg = await Vote.aggregate([
      {
        $group: {
          _id: '$district',
          count: { $sum: 1 },
        },
      },
    ]);

    const total = await Vote.countDocuments();

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

    data.sort(
      (a, b) => b.count - a.count || a.district.localeCompare(b.district)
    );

    return res.status(200).json({
      success: true,
      data,
      total,
    });
  } catch (error) {
    console.error('Error casting vote:', error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
}
