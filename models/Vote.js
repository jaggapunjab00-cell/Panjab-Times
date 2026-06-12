import mongoose from 'mongoose';

import { PUNJAB_DISTRICTS } from '../lib/districts';

const VoteSchema = new mongoose.Schema(
  {
    district: {
      type: String,
      required: true,
      enum: PUNJAB_DISTRICTS,
    },
    // We store a hashed identifier so the same browser can't vote twice.
    // We use a cookie-based UUID (set on first visit), NOT real IP storage.
    voterToken: {
      type: String,
      required: true,
      unique: true, // one vote per token, enforced at DB level
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Vote || mongoose.model('Vote', VoteSchema);