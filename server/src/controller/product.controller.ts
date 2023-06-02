import { Request, Response } from "express"

export const getAllProducts = (req: Request, res: Response): void=>{
    res.json({
        data : ['milk']
    })
}