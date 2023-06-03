import express from 'express'
import UserMiddleware from '../middleware/user.middleware'
import CartController from '../controller/cart.controller'

const router = express.Router()

router.post('/', UserMiddleware.verifyToken, CartController.addToCart)

export default router