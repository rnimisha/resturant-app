import {Request, Response, NextFunction} from 'express'
import CustomError from '../error/CustomError'

import xss from 'xss'
import ProductValidationSchema from '../validation/product.schema'
class ProductMiddleWare {
    static validateProduct = async(req: Request, res: Response, next: NextFunction): Promise<void>=> {

        // sanitize
        req.body.name = xss(req.body.name)
        req.body.description = xss(req.body.description)
        req.body.unit = xss(req.body.unit)

        // validate
        const { error } = ProductValidationSchema.validate(req.body, { abortEarly: false })


        if (error) {
            const fieldError =  error.details.map((detail) => {
                const key = detail.context?.key || ''
                return {
                    field: key,
                    description: detail.message
                }
            })

            const err = new CustomError('Error in the field', 400)
            err.setFieldError(fieldError)
            return next(err)

        }
        next()

    }
}

export default ProductMiddleWare