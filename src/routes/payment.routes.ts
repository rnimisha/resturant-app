import express from 'express'
import PaymentController from '../controller/payment.controller'


const router = express.Router()

router.post('/my-server/create-paypal-order', PaymentController.createPaypalOrder)
router.post('/my-server/capture-paypal-order', PaymentController.capturePaypalOrder)

export default router