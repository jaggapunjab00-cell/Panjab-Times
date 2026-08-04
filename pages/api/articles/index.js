import { createRouter } from 'next-connect';
import multer from 'multer';
import connectDB from '../../../lib/mongodb';
import Article from '../../../models/Article';
import { uploadImage } from '../../../lib/cloudinary';

// Store file in memory so we can pipe buffer to Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

const router = createRouter();

// ── GET /api/articles  →  fetch all articles, newest first ──
router.get(async (req, res) => {
  try {
    await connectDB();

    const page  = parseInt(req.query.page  || '1', 10);
    const limit = parseInt(req.query.limit || '12', 10);
    const skip  = (page - 1) * limit;

    const query = { 
      $or: [
        { publishedAt: { $lte: new Date() } },
        { publishedAt: { $exists: false } },
        { publishedAt: null }
      ]
    };

    const [articles, total] = await Promise.all([
      Article.find(query)
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Article.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: articles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + articles.length < total,
      },
    });
  } catch (error) {
    console.error('GET /api/articles error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch articles' });
  }
});

// ── POST /api/articles  →  create a new article ──
router.post(upload.single('image'), async (req, res) => {
  try {
    await connectDB();

    const { author, title, body, publishedAt } = req.body;

    // Basic validation
    if (!author?.trim() || !title?.trim() || !body?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Author, title, and body are all required.',
      });
    }

    let imageUrl      = null;
    let imagePublicId = null;

    // Upload image to Cloudinary if one was attached
    if (req.file) {
      const result = await uploadImage(req.file.buffer);
      imageUrl      = result.url;
      imagePublicId = result.publicId;
    }

    const articleData = {
      author:  author.trim(),
      title:   title.trim(),
      body:    body.trim(),
      imageUrl,
      imagePublicId,
    };

    if (publishedAt) {
      articleData.publishedAt = new Date(publishedAt);
    }

    const article = await Article.create(articleData);

    res.status(201).json({ success: true, data: article });
  } catch (error) {
    console.error('POST /api/articles error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join('. ') });
    }
    res.status(500).json({ success: false, message: 'Failed to publish article' });
  }
});

export const config = {
  api: {
    bodyParser: false, // multer handles parsing
  },
};

export default router.handler({
  onError(error, req, res) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: error.message || 'Server error' });
  },
  onNoMatch(req, res) {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  },
});