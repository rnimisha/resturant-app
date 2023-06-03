class Cart{
    cart_id: number
    product_id: number
    cart_prod_quantity: number
    user_id: number
    price?: number
    name?: string
    prod_quantity?: number

    constructor(cart_id: number, product_id: number,cart_prod_quantity: number, user_id: number )
    {
        this.cart_id = cart_id
        this.product_id = product_id,
        this.cart_prod_quantity = cart_prod_quantity
        this.user_id = user_id
    }

    setProductDetails(price: number, name: string, prod_quantity: number){
        this.price = price
        this.name = name
        this.prod_quantity = prod_quantity
    }

}

export default Cart