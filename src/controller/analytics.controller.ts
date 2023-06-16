import { NextFunction, Request, Response } from "express"
import AnalyticsService from "../service/analytics.services"
import CustomError from "../error/CustomError"

class AnalyticsController{
    
    static getCountAnalytics = async( req: Request, res: Response, next: NextFunction): Promise<void> =>{

        try{
            const resp = await AnalyticsService.getCountAnalytics()

            if (resp === null) throw new CustomError('Internal Server Error', 500)

            res.status(200).json({
                success: true,
                data: resp
            })

        }catch(error){
            next(error)
        }
    }
}

export default AnalyticsController