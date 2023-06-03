import pool from "../db"
import Order from "../model/order.models"


class OrderService{

    static placeOrder = async(details: Order): Promise<number |null> =>{

        
        const q = 'INSERT INTO ORDERS(user_id, payment_method, paid) VALUES($1, $2, $3) RETURNING *'

        const { rows } = await pool.query(q, [details.user_id, details.payment_method, details.paid])

        const order_id = rows[0].order_id

        details.products?.map(async (product)=>{
            const resp = await this.addOrderDetail(product.product_id, product.quantity, order_id)

            if(resp !== 'added')
            {
                return null
            }
        })

        return order_id
    }

    static addOrderDetail = async(product_id: number, quantity: number, order_id: number): Promise<string> =>{

        const q = 'INSERT INTO ORDER_DETAIL(product_id, quantity, order_id) VALUES($1, $2, $3) RETURNING *'

        const { rows } = await pool.query(q, [product_id, quantity, order_id])

        return rows[0] ? 'added' : 'error'
    }
}

export default OrderService