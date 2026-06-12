import multer from 'multer';
import connectDB from '../../../lib/mongodb';
import Article from '../../../models/Article';
import { uploadImage } from '../../../lib/cloudinary';

// Configure multer to parse files into memory buffers
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});

const runMiddleware = (req, res, fn) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 15;
      const skip = (page - 1) * limit;

      const articles = await Article.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Article.countDocuments();
      const hasMore = skip + articles.length < total;

      return res.status(200).json({
        success: true,
        data: articles,
        pagination: {
          total,
          hasMore,
        },
      });
    } catch (error) {
      console.error('Error fetching articles:', error);
      return res.status(500).json({ success: false, message: 'Server Error' });
    }
  } else if (req.method === 'POST') {
    try {
      // Parse file/fields with multer middleware
      await runMiddleware(req, res, upload.single('image'));

      const { author, title, body } = req.body;

      if (!author || !author.trim() || !title || !title.trim() || !body || !body.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Author, headline, and article body are required',
        });
      }

      let imageUrl = null;
      let imagePublicId = null;

      if (req.file) {
        try {
          const uploadResult = await uploadImage(req.file.buffer);
          imageUrl = uploadResult.url;
          imagePublicId = uploadResult.publicId;
        } catch (uploadError) {
          console.error('Error uploading image to Cloudinary (continuing without image):', uploadError);
          // Fallback: Proceed without image instead of failing the whole request
        }
      }

      const article = new Article({
        author: author.trim(),
        title: title.trim(),
        body: body.trim(),
        imageUrl,
        imagePublicId,
      });

      await article.save();

      return res.status(201).json({
        success: true,
        data: article,
      });
    } catch (error) {
      console.error('Error publishing article:', error);
      return res.status(500).json({ success: false, message: 'Server Error' });
    }
  } else {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
