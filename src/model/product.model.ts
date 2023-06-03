export interface ProductType {
    product_id: number,
    name: string,
    quantity: number,
    price: number,
    unit: string,
    description: string,
    category_id: number
}
class Product{

    product_id: number
    name: string
    quantity: number
    price: number
    unit: string
    description: string
    category_id: number

    constructor(product_id: number, name: string, quantity: number, price: number, unit: string, description: string, category_id: number){
        this.product_id = product_id
        this.name = name
        this.quantity = quantity
        this.price = price
        this.unit= unit
        this.description = description
        this.category_id = category_id
    }
}

export default Product