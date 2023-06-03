import express, { Router} from 'express'
import ProductController from '../controller/product.controller'
import ProductMiddleWare from '../middleware/product.middleware'
import upload from '../utils/multerUpload'

const router: Router = express.Router()

router.get('/', ProductController.getAllProducts)
router.get('/:id', ProductController.getProductByID)
router.post('/',  upload, ProductMiddleWare.validateProduct , ProductController.postProduct)
router.delete('/:id', ProductController.deleteProduct)
router.put('/', ProductMiddleWare.validateProduct, ProductController.updateProduct)


export default router