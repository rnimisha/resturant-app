import { NextFunction, Request, Response } from "express"
import pool from '../db'
import ProductService, { ProductFilter } from "../service/product.services"
import Product from "../model/product.model"
import CustomError from "../error/CustomError"


class ProductController{

    static getAllProducts = async ( req: Request, res: Response, next: NextFunction): Promise<void> =>{
        try{
            const filter: ProductFilter = req.query

            const products = await ProductService.getAllProducts(filter)

            if(!products)
            {
                throw new CustomError('Product Not Found', 404)
            }
             res.status(200).json({
                success: true,
                data: products
            })
        }
        catch(error){
             next(new CustomError((error as Error).message, 500))
        }
    }

    static getProductByID = async (req: Request, res: Response, next: NextFunction): Promise<void> =>{
        try{
            const id: number = Number(req.params.id);

            const product = await ProductService.getProductById(id)
            if(!product)
            {
                throw new CustomError('Product Not Found', 404)
            }
             res.status(200).json({
                success: true,
                data: product
            })
        }
        catch(error){
             next(error)
        }
    }

    static postProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> =>{
        try{

            const {name, quantity, price, description, unit, category_id} = req.body

            const newProduct = new Product(0, name, quantity, price, unit, description, category_id)
            const product = await ProductService.postProduct(newProduct)

            res.status(201).json({
                success: true,
                data: product
            })

        }
        catch(error)
        {
              next(error)
        }
    }

    static deleteProduct =async (req: Request, res: Response, next: NextFunction): Promise<void> =>{
        try{
            const id: number = Number(req.params.id)

            const resp = await ProductService.deleteProduct(id)

            if(resp !== 'deleted'){
                throw new CustomError('Product does not exist', 404)
            }

            res.status(200).json({
                success: true,
                data: []
            })
        }
        catch(error){
            next(error)
        }
    }

    static updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> =>{
         try{

            const {name, quantity, price, description, unit, category_id, product_id} = req.body

            const updatedProduct = new Product(product_id, name, quantity, price, unit, description, category_id)

            const resp = await ProductService.updateProduct(updatedProduct)

            if(resp === null){
                throw new CustomError('Product does not exist', 400)
            }
            
            res.status(200).json({
                success: true,
                data: resp
            })
        }
        catch(error){
            next(error)
        }
    }
 
}

export default ProductController
