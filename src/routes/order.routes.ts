import express from 'express'
import UserMiddleware from '../middleware/user.middleware'
import OrderController from '../controller/order.controller'

const router = express.Router()

router.post('/', UserMiddleware.verifyToken, OrderController.placeOrder)

export default router