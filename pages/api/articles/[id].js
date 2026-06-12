import connectDB from '../../../lib/mongodb';
import Article from '../../../models/Article';
import { deleteImage } from '../../../lib/cloudinary';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, message: 'Article ID is required' });
  }

  await connectDB();

  if (req.method === 'GET') {
    try {
      const article = await Article.findById(id);

      if (!article) {
        return res.status(404).json({ success: false, message: 'Article not found' });
      }

      return res.status(200).json({
        success: true,
        data: article,
      });
    } catch (error) {
      console.error('Error fetching article:', error);
      return res.status(500).json({ success: false, message: 'Server Error' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const article = await Article.findById(id);

      if (!article) {
        return res.status(404).json({ success: false, message: 'Article not found' });
      }

      // If there is an associated Cloudinary image, delete it
      if (article.imagePublicId) {
        try {
          await deleteImage(article.imagePublicId);
        } catch (cloudinaryError) {
          console.error('Failed to delete image from Cloudinary:', cloudinaryError);
          // We continue to delete the article record even if Cloudinary delete fails
        }
      }

      await Article.findByIdAndDelete(id);

      return res.status(200).json({
        success: true,
        message: 'Article deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting article:', error);
      return res.status(500).json({ success: false, message: 'Server Error' });
    }
  } else if (req.method === 'PATCH') {
    try {
      const article = await Article.findByIdAndUpdate(
        id,
        { $inc: { reads: 1 } },
        { new: true }
      );

      if (!article) {
        return res.status(404).json({ success: false, message: 'Article not found' });
      }

      return res.status(200).json({ success: true, data: article });
    } catch (error) {
      console.error('Error updating article:', error);
      return res.status(500).json({ success: false, message: 'Server Error' });
    }
  } else {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
