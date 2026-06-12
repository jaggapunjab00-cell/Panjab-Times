import mongoose from 'mongoose';

const MetricSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      unique: true,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Metric || mongoose.model('Metric', MetricSchema);
