import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      required: [true, 'Sender name is required'],
      trim: true,
      maxlength: [50, 'Sender name cannot exceed 50 characters'],
    },
    content: {
      type: String,
      required: [true, 'Message content is required'],
      trim: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
  },
  {
    timestamps: true, // adds createdAt + updatedAt automatically
  }
);

// Prevent model re-compilation on hot-reload in dev
export default mongoose.models.Message || mongoose.model('Message', MessageSchema);
