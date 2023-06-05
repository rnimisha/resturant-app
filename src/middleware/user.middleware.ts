import {Request, Response, NextFunction} from 'express'
import CustomError from '../error/CustomError'
import { checkUniquePhone, checkUniqueEmail } from '../utils/userValidation'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import xss from 'xss'
import UserValidationSchema from '../validation/user.schema'
dotenv.config()

interface VerifyRequest extends Request {
  user?: any;
}

class UserMiddleware{

    static validateRegister = async (req: Request, res: Response, next: NextFunction):Promise<void> =>{

        try{

            req.body.email = xss(req.body.email)
            req.body.password = xss(req.body.password)
            req.body.address = xss(req.body.address)
            req.body.phone = xss(req.body.phone)
            req.body.role = xss(req.body.role)

            const {error} = UserValidationSchema.validate(req.body, { abortEarly: false })

            const {email, password, name, address, phone, role}  = req.body

            if(!email ||  !password || !name || !address || !phone || !role){
                return next(new CustomError('All fields are required', 404))
            }

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
        catch(error){
            next(error)
        }
    }

    static verifyToken = async (req: VerifyRequest, res: Response, next: NextFunction):Promise<void> =>{

        const bearerHeader = req.headers['authorization']

        const token = bearerHeader && bearerHeader.split(' ')[1]

        if(!token){
            // unauthorized
            next(new CustomError('Token not provided', 401))

        }else{


            jwt.verify(token, `${process.env.SECRETKEY}`, (err, authData)=>{

                // forbidden if invalid token
                if(err) next(new CustomError('Invalid token', 403))

                req.user = authData

                next()
            })
        }

    }

    static validateAdmin = async (req: VerifyRequest, res: Response, next: NextFunction):Promise<void> =>{

        if (req.user.role.toUpperCase() !== 'A') next(new CustomError('User unauthorized', 403))

        next()

    }

}

export default UserMiddleware