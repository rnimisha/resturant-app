import express from 'express'
import UserController from '../controller/user.controller'
import UserMiddleware from '../middleware/user.middleware'

const router = express.Router()

router.post('/register', UserMiddleware.validateRegister, UserController.registerUser)
router.post('/login', UserController.loginUser)


export default router