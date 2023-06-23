import pool from "../db"
import Order from "../model/order.models"

export interface AllOrderInfo {
    orders : Order[],
    total: number
}

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
    static getOrderCount = async (status: string) : Promise<number> => {
        let q = 'SELECT COUNT(*) AS total FROM ORDERS WHERE 1 = 1'

        const data = []
        if(status !== 'all'){
            q+= ' AND UPPER(order_status) = $1'
            data.push(status.toUpperCase())
        }


        const {rows} = await pool.query(q, data)

        return rows[0].total
    }


    static getAllOrders = async(status: string, page: number, user_id: number | undefined): Promise<AllOrderInfo | null> =>{

        let q = `SELECT *
                    FROM orders o
                    WHERE 1 = 1`

        let data = []
     
        if(status !== 'all'){
            q+= ` AND UPPER(order_status) = $${data.length + 1}`
            data.push(status.toUpperCase())
        }

        if(user_id){
            q+= ` AND user_id = $${data.length + 1}`
            data.push(user_id)
        }

        q+= ' ORDER BY o.order_date desc'

        if(page && page !== 0){
            const itemPerPage = 6
            const offset = (page - 1) * itemPerPage;
            q+= ` OFFSET $${data.length + 1} LIMIT $${data.length + 2}`
            data.push(offset)
            data.push(itemPerPage)
        }

        const {rows} = await pool.query(q, data)

        if(rows.length === 0) return null

        const total = await this.getOrderCount(status)

        const orders: Order[] = rows.map((orderInfo: Order)=> {
            return new Order(
                orderInfo.order_id,
                orderInfo.user_id,
                orderInfo.order_date as string,
                orderInfo.order_status,
                orderInfo.payment_method,
                orderInfo.paid
            )
        })

        return {
            orders,
            total
        }
    }

    static updateOrderStatus  = async(order_id: number, status: string): Promise<string | null> =>{

        const q = 'UPDATE orders SET order_status = $1 WHERE order_id = $2 RETURNING *'

        const {rows} = await pool.query(q, [status, order_id])
        if(rows.length === 0) return null

        return rows[0].order_status
    }
}

export default OrderService