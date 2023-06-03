export interface ProductType {
    product_id: number,
    name: string,
    quantity: number,
    price: number,
    unit: string,
    description: string,
    category_id: number,
    images?: [string]
}
class Product{

    product_id: number
    name: string
    quantity: number
    price: number
    unit: string
    description: string
    category_id: number
    images?: [string]

    constructor(product_id: number, name: string, quantity: number, price: number, unit: string, description: string, category_id: number){
        this.product_id = product_id
        this.name = name
        this.quantity = quantity
        this.price = price
        this.unit= unit
        this.description = description
        this.category_id = category_id
    }

    setImage(image: string)
    {
        this.images?.push(image)
    }
    
    setImageArray(images: [string])
    {
        this.images = images
    }
}

export default Product