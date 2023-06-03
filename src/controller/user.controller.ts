import { Request, Response, NextFunction} from 'express'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt';
import CustomError from '../error/CustomError';
import User from '../model/user.model';
import UserService from '../service/user.services';
import jwt from 'jsonwebtoken'

dotenv.config()

class UserController{

    static registerUser = async(req: Request, res: Response, next: NextFunction): Promise<void> =>{
        try{

            const { email, password, name, address, phone, role} = req.body
            const saltRounds = 10;

            const hashed = await bcrypt.hash(password, saltRounds)

            const newUser = new User(
                0,
                email,
                hashed,
                name,
                address,
                phone,
                role
            )

            const resp = await UserService.registerUser(newUser)

            if(resp === null) throw new CustomError('Error registering user', 500)

            const token = jwt.sign({ user_id: resp.user_id, email: resp.email, role: resp.role }, `${process.env.SECRETKEY}`);

            res.status(200).json({
                success: true,
                data: {
                    user_id: resp.user_id,
                    email: resp.email,
                    name: resp.name,
                    address:resp.address,
                    phone: resp.phone,
                    role: resp.role,
                    token
                }
            })

        }
        catch(error){
            next(error)
        }
    }

    static loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const {email, password} = req.body

            const user = await UserService.loginUser(email)

            if(!user){
                const err = new CustomError('Error login', 404)
                err.setFieldError([{
                    field : 'email',
                    description: 'Email is not registered'
                }])
                throw err
            }
            else{

                const match = await bcrypt.compare(password, user.password)

                if(!match){
                    const err = new CustomError('Error login', 404)
                    err.setFieldError([{
                        field : 'password',
                        description: 'Password does not match'
                    }])
                    throw err
                }

                const token = jwt.sign({ user_id: user.user_id, email: user.email, role: user.role }, `${process.env.SECRETKEY}`);

                res.status(200).json({
                    success: true,
                    data: {
                        user_id: user.user_id,
                        email: user.email,
                        name: user.name,
                        address:user.address,
                        phone: user.phone,
                        role: user.role,
                        token
                    }
                })
            }

            
        }
        catch(error){
            next(error)
            
        }
    }
}

export default UserController