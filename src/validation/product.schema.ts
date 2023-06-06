import Joi from "joi"

const ProductValidationSchema = Joi.object({
    product_id: Joi.number(),
    name:Joi.string().required(),
    quantity: Joi.number().integer().positive().required(), 
    price: Joi.number().positive().required(), 
    description: Joi.string().required(), 
    unit: Joi.string().required(), 
    category_id: Joi.number().integer().positive().required()
})

export default ProductValidationSchema