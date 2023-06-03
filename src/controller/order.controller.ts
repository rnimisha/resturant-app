import { NextFunction, Request, Response } from "express"
import Order from "../model/order.models"
import OrderService from "../service/order.services"
import CustomError from "../error/CustomError"

class OrderController{

    static placeOrder = async( req: Request, res: Response, next: NextFunction): Promise<void> =>{

        try{
            const {user_id, payment_method, paid, products} = req.body

            const newOrder = new Order(
                0,
                user_id,
                '',
                'Received',
                payment_method,
                paid
            )
            newOrder.setProducts(products)

            const order_id = await OrderService.placeOrder(newOrder)
            if(order_id === null) throw new CustomError('Error not placed', 500)

            res.status(200).json({
                success: true,
                data: {
                    order_id
                }
            })
        }
        catch(error){

            next(error)
        }
    }

    static getOrderDetailsById = async( req: Request, res: Response, next: NextFunction): Promise<void> =>{
        try{
            const id = Number(req.params.id)

            const orders = await OrderService.getOrderDetailsById(id)

            if(orders === null) throw new CustomError('Order Not Found', 404)

            res.status(200).json({
                success: true,
                data: orders
            })

        }
        catch(error){
            next(error)
        }
    }
}

export default OrderController