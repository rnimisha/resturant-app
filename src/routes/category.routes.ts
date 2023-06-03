import express from 'express'
import CategoryController from '../controller/category.controller'
import CategoryMiddleware from '../middleware/category.middleware'
import upload from '../utils/multerUpload'

const router = express.Router()

router.get('/', CategoryController.getAllCategory)
router.post('/', upload, CategoryMiddleware.validateCategory, CategoryController.postCategory)


export default router