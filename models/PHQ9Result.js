// models/PHQ9Result.js
import mongoose from 'mongoose'

const Phq9ResultSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: 'User',
    required: true,
  },
  scores: {
    type: [Number],
    validate: [arr => arr.length === 9, 'Must have 9 values'],
    required: true,
  },
  totalScore: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  }
})

export default mongoose.model('Phq9Result', Phq9ResultSchema)
