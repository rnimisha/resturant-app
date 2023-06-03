
type Products = {
    product_id: number
    quantity: number
    price?: number
    name?: string
}

class Order{
    order_id : number
    user_id: number
    order_date: string 
    order_status: string 
    payment_method: string
    paid: string
    products?: [Products]

    constructor(order_id : number, user_id: number, order_date: string , order_status: string ,payment_method: string, paid: string)
    {
        this.order_id = order_id
        this.user_id = user_id
        this.order_date = order_date
        this.order_status = order_status
        this.payment_method = payment_method
        this.paid = paid
    }

    setProducts (products: [Products]){
        this.products = products
    }
}

export default Order