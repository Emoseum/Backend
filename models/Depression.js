// models/Depression.js
import mongoose from 'mongoose';

const DepressionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  score: { type: Number, required: true },               // 우울 점수 int
  createdAt: { type: String, required: true }                 // ISO string (ex: 2025-07-02T12:34:56Z)
});

// const Depression = mongoose.model('Depression', DepressionSchema);
// export default Depression;
export default mongoose.model('Depression', DepressionSchema, 'Depression');