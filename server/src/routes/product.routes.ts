import express, { Router} from 'express'
import ProductController from '../controller/product.controller'

const router: Router = express.Router()

router.get('/', ProductController.getAllProducts)

export default router