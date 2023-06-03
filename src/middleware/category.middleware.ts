import {Request, Response, NextFunction} from 'express'
import CustomError from '../error/CustomError'

class CategoryMiddleware {
    static validateCategory = async(req: Request, res: Response, next: NextFunction): Promise<void>=> {

        const {category_name} = req.body

        if(!category_name)
        {
            const err = new CustomError('Error in the field', 400)
            const fieldError = [
                {
                    field : 'category_name',
                    description: 'Category name is required'
                }
            ]
            err.setFieldError(fieldError)
            return next(err)
        }

        next()

    }
}

export default CategoryMiddleware