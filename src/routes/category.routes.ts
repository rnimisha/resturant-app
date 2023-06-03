import express from 'express'
import CategoryController from '../controller/category.controller'

const router = express.Router()

router.get('/', CategoryController.getAllCategory)


export default router