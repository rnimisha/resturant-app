import pool from "../db";
import Product, {ProductType} from "../model/product.model";

export interface ProductFilter {
    name?: string,
    quantity?: number,
    minPrice?: number,
    maxPrice?: number,
    category_id?: number
}

class ProductService{

    static getAllProducts = async(filter: ProductFilter): Promise<Product[] | null> =>{

        let q = 'SELECT * FROM product WHERE UPPER(status) = \'A\''

        const queryParams = []


        //------------------filter by price-------------------------

        if (filter.minPrice) {
            q+= ` AND price >= $${queryParams.length + 1}`
            queryParams.push(filter.minPrice)
        }

        if (filter.maxPrice) {
            q+= ` AND price <= $${queryParams.length + 1}`
            queryParams.push(filter.maxPrice)
        }


        //------------------filter by category-------------------------
        if(filter.category_id){
            q+= ` AND category_id = $${queryParams.length + 1}`
            queryParams.push(filter.category_id)
        }

        //-------------filter by name of product-----------------------
        if(filter.name?.trim()){
            q+= ` AND UPPER(name) LIKE $${queryParams.length+1}`
            const name: string = filter.name.trim().toUpperCase()
            queryParams.push(`%${name}%`)
        }

        //-------------filter by quantity of product------------------
         if(filter.quantity){
            q+= ` AND quantity = $${queryParams.length + 1}`
            queryParams.push(filter.quantity)
        }

       

        const {rows} = await pool.query(q, queryParams)

        if ( rows.length === null) return null

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

        const q = 'SELECT * FROM PRODUCT WHERE UPPER(status)= \'A\' AND PRODUCT_ID = $1'

        const {rows} = await pool.query(q, [id])
        if(rows.length === 0)  {
            return null
        }

        const product: ProductType = rows[0]
        return new Product(
            product.product_id,
            product.name,
            product.quantity,
            product.price,
            product.unit,
            product.description,
            product.category_id
        )
    
    }

    static postProduct = async(product: Product): Promise<Product | null> =>{
        
        const q = 'INSERT INTO product(name, quantity, price, unit, description, category_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING product_id'
        
        const {rows} = await pool.query(q, [product.name, product.quantity, product.price, product.unit, product.description, product.category_id])

        const product_id: number = rows[0].product_id

        if(product.images){
            product.images.map(async (img) =>{
                const resp = await this.uploadImage(product_id, img)

                if(resp !== 'added')
                {
                    return null
                }
            })
            
        }

        return new Product(
            product_id,
            product.name,
            product.quantity,
            product.price,
            product.unit,
            product.description,
            product.category_id
        )
    }

    static uploadImage = async(id:number, image: string) =>{

        const q = 'INSERT INTO product_image(image_name, product_id) VALUES($1, $2) RETURNING *'

        const {rows} = await pool.query(q, [image, id])
        
        return rows[0] ? 'added' : 'no product'
    }

    static deleteProduct = async(id:number): Promise<string> =>{

        const q = 'UPDATE product SET status = \'I\' WHERE UPPER(status)=\'A\' AND product_id = $1 RETURNING *'
        const {rows} = await pool.query(q, [id])

        return rows[0] ? 'deleted' : 'no product'
    }

    static updateProduct = async(product: Product): Promise<Product | null> =>{

        const q = 'UPDATE product SET name=$1, quantity=$2, price=$3, unit=$4, description=$5, category_id=$6 WHERE product_id = $7 RETURNING *'

        const {rows} = await pool.query(q, [product.name, product.quantity, product.price, product.unit, product.description, product.category_id, product.product_id])


        if(rows[0]){
            const {name, quantity, price, unit, description, category_id, product_id} = rows[0]
        
            const updateProduct = new Product(
                product_id,
                name,
                quantity,
                price,
                unit,
                description,
                category_id
            )

            return updateProduct
        }else{
            return null
        }
        
    }

}


export default ProductService