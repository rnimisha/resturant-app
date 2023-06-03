import express, { Router} from 'express'
import ProductController from '../controller/product.controller'
import ProductMiddleWare from '../middleware/product.middleware'

const router: Router = express.Router()

router.get('/', ProductController.getAllProducts)
router.get('/:id', ProductController.getProductByID)
router.post('/', ProductMiddleWare.validateProduct , ProductController.postProduct)
router.delete('/:id', ProductController.deleteProduct)


export default router