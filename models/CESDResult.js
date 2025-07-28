// models/CESDResult.js
import mongoose from 'mongoose'

const CesdResultSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: 'User',
    required: true,
  },
  scores: {
    type: [Number],
    validate: [arr => arr.length === 20, 'Must have 20 values'],
    required: true,
  },
  totalScore: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: () => new Date(), // ⏱️ 저장은 UTC로
  }
})

export default mongoose.model('CesdResult', CesdResultSchema)
