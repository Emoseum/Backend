// models/User.js

import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, // 'id'
  password: { type: String, required: true },             // pw → password
  style: {                                                // 화풍 스타일
    type: [String],
    enum: [
      'blackWhiteBold',
      'warmCubism',
      'chaoticTexture',
      'vividNature',
      'europeRetro',
      'darkEmotion',
      'flatColorRetro',
      'neonAbstract',
      'streetRealism'
    ],
    default: ['streetRealism']
  },

  createdAt: { type: String, required: true },            // ISO string
});

export default mongoose.model('User', UserSchema, 'Users');