import { NextFunction, Request, Response } from "express"
import Cart from "../model/cart.model"
import CartService from "../service/cart.services"
import CustomError from "../error/CustomError"

class CartController{

    static addToCart = async( req: Request, res: Response, next: NextFunction): Promise<void> =>{
        try{

            const { product_id, cart_prod_quantity, user_id} = req.body
            const newCart = new Cart(
                0,
                product_id,
                cart_prod_quantity,
                user_id
            )

            const cartProduct = await CartService.addToCart(newCart)

            if (cartProduct === null) throw new CustomError('Product could not be added to cart', 400)

            res.status(200).json({
                success: true,
                data: cartProduct
            })
        }
        catch(error){
            next(error)
        }
    }

    static getCartProducts= async( req: Request, res: Response, next: NextFunction): Promise<void> =>{
        try{
            const id = Number(req.params.id)

            const carts = await CartService.getCartProducts(id)

            res.status(200).json({
                success: true,
                data: carts || []
            })
        }
        catch(error){

        }
    }

    static deleteCartProduct= async( req: Request, res: Response, next: NextFunction): Promise<void> =>{
        try{
            const cart_id = Number(req.body.cart_id)
            const user_id = Number(req.body.user_id)

            const carts = await CartService.deleteCartProduct(cart_id, user_id)
            
            if(carts !== 'deleted') throw new CustomError('Cannot delete cart item', 500)

            res.status(200).json({
                success: true
            })
        }
        catch(error){

            next(error)
        }
    }
}

export default CartController