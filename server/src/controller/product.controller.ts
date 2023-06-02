import { Request, Response } from "express"
import pool from '../db'

export const getAllProducts = async (req: Request, res: Response): Promise<void>=>{
    try{
        const data = await pool.query('Select * from product')

        res.json({
            success: true,
            data: data.rows
        })
    }catch(err)
    {
        res.status(500).json({
            success: false,
            msg: (err as Error).message
        })
    }
    
}