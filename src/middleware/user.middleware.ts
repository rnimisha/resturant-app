import {Request, Response, NextFunction} from 'express'
import CustomError from '../error/CustomError'
import { checkUniquePhone, checkUniqueEmail } from '../utils/userValidation'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import xss from 'xss'
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