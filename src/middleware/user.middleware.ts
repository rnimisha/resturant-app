import {Request, Response, NextFunction} from 'express'
import CustomError from '../error/CustomError'
import { checkUniquePhone, checkUniqueEmail } from '../utils/userValidation'

class UserMiddleware{

    static validateRegister = async (req: Request, res: Response, next: NextFunction):Promise<void> =>{

        try{
            const {email, password, name, address, phone, role}  = req.body

            if(!email ||  !password || !name || !address || !phone || !role){
                return next(new CustomError('All fields are required', 404))
            }

            const fieldError = []

            //----------------- Check unique email----------------------
            const email_length = await checkUniqueEmail(email)
            if(email_length !== 0){
                fieldError.push({
                    field: 'email',
                    description: 'Email is already registered'
                })
            }

            //----------------- Check unique phone----------------------
            const phone_length = await checkUniquePhone(phone)
            if(phone_length !== 0){
                fieldError.push({
                    field: 'phone',
                    description: 'Phone is already registered'
                })
            }

            if(fieldError.length > 0){
                const err = new CustomError('Error in the field', 400)
                err.setFieldError(fieldError)
                return next(err)
            }

            next()
    
        }
        catch(error){
            next(error)
        }
    }
}

export default UserMiddleware