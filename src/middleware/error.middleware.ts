import { Request , Response, NextFunction} from "express"
import CustomError from "../error/CustomError"


const errorMiddleware = (error: CustomError, req: Request, res: Response, next: NextFunction)=>{
    const statusCode = error.statusCode || 500
    const message = error.message 
    const fieldError = error.fieldError || []
    res.status(statusCode).json({
        success : false,
        msg: message,
        fieldError
    })
}

export default errorMiddleware