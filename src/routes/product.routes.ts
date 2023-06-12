import express, { Router} from 'express'
import ProductController from '../controller/product.controller'
import ProductMiddleWare from '../middleware/product.middleware'
import upload from '../utils/multerUpload'
import UserMiddleware from '../middleware/user.middleware'

const router: Router = express.Router()

router.get('/', ProductController.getAllProducts)
router.get('/minmaxprice', ProductController.getMinMaxPrice)
router.get('/:id', ProductController.getProductByID)
router.post('/', UserMiddleware.verifyToken,  upload, ProductMiddleWare.validateProduct , ProductController.postProduct)
router.delete('/:id', UserMiddleware.verifyToken, ProductController.deleteProduct)
router.put('/',  UserMiddleware.verifyToken, ProductMiddleWare.validateProduct, ProductController.updateProduct)


export default router


