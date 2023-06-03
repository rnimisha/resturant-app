import pool from "../db";
import Product from "../model/product.model";

interface ProductType {
    product_id: number,
    name: string,
    quantity: number,
    price: number,
    unit: string,
    description: string,
    category_id: number
}

class ProductService{

    static  getAllProducts = async (): Promise<Product[]>=>{
        const q = 'SELECT * FROM PRODUCT'
        const {rows} = await pool.query(q)
        const products: Product[] = rows.map((product: ProductType)=> new Product(
            product.product_id,
            product.name,
            product.quantity,
            product.price,
            product.unit,
            product.description,
            product.category_id
        ))

        return products
    }
}


export default ProductService