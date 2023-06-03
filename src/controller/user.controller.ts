import { Request, Response, NextFunction} from 'express'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt';
import CustomError from '../error/CustomError';
import User from '../model/user.model';
import UserService from '../service/user.services';
import jwt from 'jsonwebtoken'

dotenv.config()

class UserController{

    static registerUser = async(req: Request, res: Response, next: NextFunction)=>{
        try{

            const { email, password, name, address, phone, role} = req.body
            const saltRounds = 10;

            const hashed = await bcrypt.hash(password, saltRounds)

            const newUser = new User(
                0,
                email,
                password,
                name,
                address,
                phone,
                role
            )

            const resp = await UserService.registerUser(newUser)

            if(resp === null) throw new CustomError('Error registering user', 500)

            const token = jwt.sign({ user_id: resp.user_id, email: resp.email }, `${process.env.SECRETKEY}`);

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
}

export default UserController