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

    static getProductById = async (id : number): Promise<Product | null> =>{

        const q = 'SELECT * FROM PRODUCT WHERE PRODUCT_ID = $1'

        const {rows} = await pool.query(q, [id])
        if(rows.length === 0)  {
            return null
        }

        const product: ProductType = rows[0]
        return new Product(product.product_id,
            product.name,
            product.quantity,
            product.price,
            product.unit,
            product.description,
            product.category_id
        )
    
    }
}


export default ProductService