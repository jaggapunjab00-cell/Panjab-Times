import connectDB from '../../../../lib/mongodb';
import Article from '../../../../models/Article';
import { parse } from 'cookie';

const SESSION_SECRET = 'pt_admin_auth_2024';

function isAuthenticated(req) {
  const cookies = parse(req.headers.cookie || '');
  return cookies.pt_admin_session === SESSION_SECRET;
}

export default async function handler(req, res) {
  if (!isAuthenticated(req)) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  if (req.method !== 'DELETE') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id || !/^[a-f\d]{24}$/i.test(id)) {
    return res.status(400).json({ success: false, message: 'Invalid article ID' });
  }

  try {
    await connectDB();

    const article = await Article.findByIdAndDelete(id);

    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    return res.status(200).json({ success: true, message: 'Article deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/admin/articles/[id] error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete article' });
  }
}
