import { NextFunction, Request, Response } from "express"
import pool from '../db'
import ProductService from "../service/product.services"
import Product from "../model/product.model"
import CustomError from "../error/CustomError"


class ProductController{

    static getAllProducts = async (req: Request, res: Response, next: NextFunction): Promise<void>=>{
        try{
            const products: Product[] = await ProductService.getAllProducts()
            res.json({
                success: true,
                data: products
            })
        }catch(error)
        {
            next(new CustomError((error as Error).message, 500))
        }
        
    }
}

export default ProductController
