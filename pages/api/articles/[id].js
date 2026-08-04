import connectDB from '../../../lib/mongodb';
import Article from '../../../models/Article';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { id } = req.query;

  // Basic ObjectId format check to avoid a Mongoose cast error
  if (!id || !/^[a-f\d]{24}$/i.test(id)) {
    return res.status(400).json({ success: false, message: 'Invalid article ID' });
  }

  try {
    await connectDB();

    const article = await Article.findById(id).lean();

    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    res.status(200).json({ success: true, data: article });
  } catch (error) {
    console.error('GET /api/articles/[id] error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch article' });
  }
}