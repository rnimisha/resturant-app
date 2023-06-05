import Joi from "joi"

const UserValidationSchema = Joi.object({
    email: Joi.string().email().required(), 
    password: Joi.string().min(7).required(), 
    name:Joi.string().required(),
    address:Joi.string().required(),
    phone:Joi.string().min(10).required(), 
    role: Joi.string().valid('A', 'C').required()
})

export default UserValidationSchema