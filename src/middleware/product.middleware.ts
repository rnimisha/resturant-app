import {Request, Response, NextFunction} from 'express'
import CustomError from '../error/CustomError'

import xss from 'xss'
class ProductMiddleWare {
    static validateProduct = async(req: Request, res: Response, next: NextFunction): Promise<void>=> {

        req.body.name = xss(req.body.name)
        req.body.description = xss(req.body.description)
        req.body.unit = xss(req.body.unit)

        const {name, quantity, price, description, unit, category_id} = req.body

        if(!name ||  !quantity ||  !price || !description || !unit || !category_id)
        {
            return next(new CustomError('All fields are required', 400))
        }


        const fieldError = []
        if(quantity < 0)
        {
            fieldError.push({
                field: 'quantity',
                description: 'Quantity cannot be less than 0'
            })
        }

        if(price < 0)
        {
            fieldError.push({
                field: 'price',
                description: 'Price cannot be less than 0'
            })
        }

        // when any error in the field
        if(fieldError.length > 0){
            const err = new CustomError('Error in the field', 400)
            err.setFieldError(fieldError)
            return next(err)
        }

        next()

    }
}

export default ProductMiddleWare