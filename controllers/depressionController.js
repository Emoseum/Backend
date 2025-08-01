import Phq9Result from '../models/PHQ9Result.js'
import CesdResult from '../models/CESDResult.js'
import { toAustriaISO } from '../utils/time.js'
import axios from 'axios'

/* PHQ-9 저장 */
export const submitPhq9 = async (req, res) => {
  const { scores } = req.body
  if (!scores || scores.length !== 9) {
    return res.status(400).json({ error: 'Scores must contain 9 values' })
  }

  const totalScore = scores.reduce((sum, val) => sum + val, 0)

  const result = await Phq9Result.create({
    userId: req.user.userId,
    scores,
    totalScore,
  })

  // AI 서버에 PHQ-9 결과 전송
  try {
    await axios.post(`${process.env.AI_SERVER_URL}/api/psychometric/phq9`, {
      user_id: req.user.userId,
      phq9_score: totalScore,
      scores: scores,
      test_date: result.createdAt
    })
  } catch (error) {
    console.log('AI 서버 PHQ-9 업데이트 실패:', error.message)
  }

  res.status(201).json({
    id: result._id,
    scores: result.scores,
    totalScore: result.totalScore,
    createdAt: toAustriaISO(result.createdAt),
  })
}

/* PHQ-9 조회 */
export const getPhq9Results = async (req, res) => {
  const userId = req.user.userId
  const results = await Phq9Result.find({ userId }).sort({ createdAt: -1 })

  const withTime = results.map(r => ({
    ...r.toObject(),
    createdAtAustria: toAustriaISO(r.createdAt)
  }))

  res.status(200).json(withTime)
}

/* PHQ-9 삭제 */
export const deletePhq9Result = async (req, res) => {
  const resultId = req.params.id
  const userId = req.user.userId

  const result = await Phq9Result.findById(resultId)
  if (!result) return res.status(404).json({ error: 'Result not found' })
  if (result.userId.toString() !== userId) {
    return res.status(403).json({ error: 'Not authorized' })
  }

  await Phq9Result.findByIdAndDelete(resultId)
  res.status(200).json({ message: 'PHQ-9 result deleted' })
}

/* CES-D 저장 */
export const submitCesd = async (req, res) => {
  const { scores } = req.body
  if (!scores || scores.length !== 20) {
    return res.status(400).json({ error: 'Scores must contain 20 values' })
  }

  const totalScore = scores.reduce((sum, val) => sum + val, 0)

  const result = await CesdResult.create({
    userId: req.user.userId,
    scores,
    totalScore,
  })

  // AI 서버에 CES-D 결과 전송
  try {
    await axios.post(`${process.env.AI_SERVER_URL}/api/psychometric/cesd`, {
      user_id: req.user.userId,
      cesd_score: totalScore,
      scores: scores,
      test_date: result.createdAt
    })
  } catch (error) {
    console.log('AI 서버 CES-D 업데이트 실패:', error.message)
  }

  res.status(201).json({
    id: result._id,
    scores: result.scores,
    totalScore: result.totalScore,
    createdAt: toAustriaISO(result.createdAt),
  })
}

/* CES-D 조회 */
export const getCesdResults = async (req, res) => {
  const userId = req.user.userId
  const results = await CesdResult.find({ userId }).sort({ createdAt: -1 })

  const withTime = results.map(r => ({
    ...r.toObject(),
    createdAtAustria: toAustriaISO(r.createdAt)
  }))

  res.status(200).json(withTime)
}

/* CES-D 삭제 */
export const deleteCesdResult = async (req, res) => {
  const resultId = req.params.id
  const userId = req.user.userId

  const result = await CesdResult.findById(resultId)
  if (!result) return res.status(404).json({ error: 'Result not found' })
  if (result.userId.toString() !== userId) {
    return res.status(403).json({ error: 'Not authorized' })
  }

  await CesdResult.findByIdAndDelete(resultId)
  res.status(200).json({ message: 'CES-D result deleted' })
}
