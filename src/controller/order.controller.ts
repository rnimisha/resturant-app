import { NextFunction, Request, Response } from "express"
import Order from "../model/order.models"
import OrderService from "../service/order.services"
import CustomError from "../error/CustomError"
import xss from "xss"
import UserService from "../service/user.services"
import MailService from "../service/mail.services"

class OrderController{

    static placeOrder = async( req: Request, res: Response, next: NextFunction): Promise<void> =>{

        try{
            let {user_id, payment_method, paid, products} = req.body

            payment_method = xss(payment_method)
            paid = xss(paid)

            const newOrder = new Order(
                0,
                user_id,
                '',
                'Order Received',
                payment_method,
                paid
            )
            newOrder.setProducts(products)

            const order_id = await OrderService.placeOrder(newOrder)
            if(order_id === null) throw new CustomError('Error not placed', 500)

            const orderDetails = await OrderService.getOrderDetailsById(order_id)

            const email = await UserService.getUserEmail(user_id)
            if(email !== null && orderDetails !== null){
                await MailService.sendOrderMail( email, orderDetails)
            }

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
    
    static updateOrderStatus =  async( req: Request, res: Response, next: NextFunction): Promise<void> =>{
        try{
            const order_id = Number(req.body.order_id)
            const status = xss(req.body.status)

            const orders = await OrderService.updateOrderStatus(order_id, status)

            if(orders === null) throw new CustomError('Order Not Found', 404)

            res.status(200).json({
                success: true,
                data: {
                    order_status: orders
                }
            })

        }
        catch(error){
            next(error)
        }
    }
}

export default OrderController