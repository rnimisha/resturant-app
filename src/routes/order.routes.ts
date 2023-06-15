import express from 'express'
import UserMiddleware from '../middleware/user.middleware'
import OrderController from '../controller/order.controller'

const router = express.Router()

router.post('/', UserMiddleware.verifyToken, OrderController.placeOrder)
router.get('/all', UserMiddleware.verifyToken, OrderController.getAllOrders)
router.get('/:id', UserMiddleware.verifyToken, OrderController.getOrderDetailsById)
router.put('/status', UserMiddleware.verifyToken, OrderController.updateOrderStatus)

export default router