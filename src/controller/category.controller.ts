import { NextFunction, Request, Response } from "express"
import CategoryService from "../service/category.services"
import CustomError from "../error/CustomError"

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
}

export default CategoryController