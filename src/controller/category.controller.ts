import { NextFunction, Request, Response } from "express"
import CategoryService from "../service/category.services"
import CustomError from "../error/CustomError"
import Category from "../model/category.model"
import xss from "xss"

class CategoryController{

    static getAllCategory = async( req: Request, res: Response, next: NextFunction): Promise<void> =>{

        try{
            const categories = await CategoryService.getAllCategory()

            if(!categories){
                throw new CustomError('No Categories Found', 404)
            }

            res.status(200).json({
                success: true,
                data: categories
            })
        }
        catch(error){
            next(error)
        }
    }


    static postCategory = async( req: Request, res: Response, next: NextFunction): Promise<void> =>{
         try{

            if(!req.file)
            {
                throw new CustomError('Error uploading image', 400)
            }
            
            const image = req.file.filename
            const category_name = xss(req.body.category_name)

            const newCategory = new Category(
                0,
                category_name,
                image
            )
            const category = await CategoryService.postCategory(newCategory)

            if(!category){
                throw new CustomError('Error adding category', 500)
            }

            res.status(200).json({
                success: true,
                data: category
            })
        }
        catch(error){
            next(error)
        }
    }

}

export default CategoryController