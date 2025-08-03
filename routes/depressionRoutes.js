// routes/depression.js
import express from 'express'
import {
  submitPhq9,
  getPhq9Results,
  deletePhq9Result,
  submitCesd,
  getCesdResults,
  deleteCesdResult
} from '../controllers/depressionController.js'
import {authenticateToken} from '../middleware/authenticateToken.js'

const router = express.Router()

// PHQ-9
router.post('/phq9', authenticateToken, submitPhq9)
router.get('/phq9', authenticateToken, getPhq9Results)
router.delete('/phq9/:id', authenticateToken, deletePhq9Result)

// CES-D
router.post('/cesd', authenticateToken, submitCesd)
router.get('/cesd', authenticateToken, getCesdResults)
router.delete('/cesd/:id', authenticateToken, deleteCesdResult)

export default router
