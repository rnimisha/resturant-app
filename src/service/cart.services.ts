import pool from "../db"
import Cart from "../model/cart.model"

class CartService{

    static addToCart = async(details: Cart): Promise<Cart | null> =>{

        const q = 'INSERT INTO CART(cart_prod_quantity, product_id, user_id) VALUES($1, $2, $3) RETURNING *'

        const { rows } = await pool.query(q, [details.cart_prod_quantity, details.product_id, details.user_id])

        if( rows.length === 0) return null

        const product_query = 'SELECT * FROM product WHERE product_id = $1'

        const productData = await pool.query(product_query, [ details.product_id])

        const newCart = new Cart(
            rows[0].cart_id,
            details.product_id,
            details.cart_prod_quantity,
            details.user_id,
        )
        const productRow = productData.rows[0]

        newCart.setProductDetails(productRow.price, productRow.name, productRow.quantity)

        return newCart
    }
}

export default CartService