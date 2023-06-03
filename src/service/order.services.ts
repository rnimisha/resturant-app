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

    static getOrderDetailsById = async(order_id: number): Promise<Order | null> =>{

        const q = `SELECT o.order_id, o.order_date, order_status, payment_method, paid, od.quantity, price, p.product_id, name, user_id
                    FROM orders o
                    JOIN order_detail od
                    ON o.order_id = od.order_id
                    JOIN product p 
                    ON od.product_id = p.product_id
                    WHERE o.order_id = $1`

        const {rows} = await pool.query(q, [order_id])

        if(rows.length === 0) return null

        const orderInfo = rows[0]

        const newOrder = new Order(
            orderInfo.order_id,
            orderInfo.user_id,
            orderInfo.order_date,
            orderInfo.order_status,
            orderInfo.payment_method,
            orderInfo.paid
        )

        const product = rows.reduce((acc, current)=>{

            return [...acc, {name: current.name, price: current.price, quantity: current.quantity, product_id: current.product_id}]
        }, [])

        newOrder.setProducts(product)

        return newOrder
    }
}

export default OrderService