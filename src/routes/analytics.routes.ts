import express from 'express'
import UserMiddleware from '../middleware/user.middleware'
import AnalyticsController from '../controller/analytics.controller'

const router = express.Router()

router.get('/counts', UserMiddleware.verifyToken, AnalyticsController.getCountAnalytics)

export default router