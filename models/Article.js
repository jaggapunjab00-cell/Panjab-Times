import mongoose from 'mongoose';

const ArticleSchema = new mongoose.Schema(
  {
    author: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
      maxlength: [80, 'Author name cannot exceed 80 characters'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    body: {
      type: String,
      required: [true, 'Article body is required'],
      trim: true,
      maxlength: [50000, 'Article body cannot exceed 50,000 characters'],
    },
    imageUrl: {
      type: String,
      default: null,
    },
    imagePublicId: {
      type: String,
      default: null,
    },
    readTime: {
      type: Number, // minutes — computed on save
      default: 1,
    },
    reads: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // adds createdAt + updatedAt automatically
  }
);

// Auto-compute read time before saving (avg 200 words/min)
ArticleSchema.pre('save', function (next) {
  const wordCount = this.body.split(/\s+/).length;
  this.readTime = Math.max(1, Math.ceil(wordCount / 200));
  next();
});

// Prevent model re-compilation on hot-reload in dev
export default mongoose.models.Article ||
  mongoose.model('Article', ArticleSchema);