import express from 'express'
import UserController from '../controller/user.controller'

const router = express.Router()

router.post('/register', UserController.registerUser)


export default router