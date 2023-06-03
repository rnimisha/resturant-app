import { Request , Response, NextFunction} from "express"
import CustomError from "../error/CustomError"


const errorMiddleware = (error: CustomError, req: Request, res: Response, next: NextFunction)=>{
    const {statusCode, message} = error

    res.status(statusCode).json({
        success : false,
        msg: message
    })
}

export default errorMiddleware