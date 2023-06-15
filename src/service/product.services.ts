import pool from "../db";
import Product, {ProductType} from "../model/product.model";

export interface ProductFilter {
    name?: string,
    quantity?: number,
    minPrice?: number,
    maxPrice?: number,
    category_id?: number,
    categories?: number[],
    page?: number
}

export interface ProductInfo {
    product : Product[],
    total: number
}

class ProductService{

    static getAllProducts = async(filter: ProductFilter): Promise<ProductInfo | null> =>{

        let q = 'SELECT p.product_id, name, quantity, price,unit, description, category_id, status, image_name as image FROM product p JOIN product_image i ON p.product_id = i.product_id WHERE UPPER(status) = \'A\''

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

        if(filter.categories && filter.categories.length > 0){
            q+= ` AND category_id IN (${filter.categories})`
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

        //-------------order by ---------------------------------
        q+= ` ORDER BY p.product_id DESC`

        const total = await this.getProductCount()

        //-------------pagenation-----------------------------------
        if(filter.page){
            const itemPerPage = 6
            const offset = (filter.page - 1) * itemPerPage;
            q+= ` OFFSET $${queryParams.length + 1} LIMIT $${queryParams.length + 2}`
            queryParams.push(offset)
            queryParams.push(itemPerPage)
        }

        const {rows} = await pool.query(q, queryParams)

        if ( rows.length === null) return null


           const products: Product[] = rows.map((product: ProductType)=> {
                const newProduct = new Product(
                    product.product_id,
                    product.name,
                    product.quantity,
                    product.price,
                    product.unit,
                    product.description,
                    product.category_id
                )

                if (product.image) newProduct.setImageArray([product.image])
                
                return newProduct
           })

        return {
            product: products,
            total
        }
    }

    static getMinMaxPrice = async () : Promise<number[]> =>{

        const q = 'select max(price) as maxprice, min(price) as minprice from product'
        const {rows} = await pool.query(q)

        const prices = rows[0]

        return [prices.minprice, prices.maxprice]
    }

    static getProductCount = async () : Promise<number> => {
        const q = 'SELECT COUNT(*) AS total FROM PRODUCT WHERE UPPER(status)= \'A\''
        const {rows} = await pool.query(q)

        return rows[0].total
    }

    static getProductById = async (id : number): Promise<Product | null> =>{

        const q = 'SELECT p.product_id, name, quantity, price,unit, description, category_id, status, image_name as image FROM product p JOIN product_image i ON p.product_id = i.product_id  WHERE UPPER(status)= \'A\' AND p.PRODUCT_ID = $1'

        const {rows} = await pool.query(q, [id])
        if(rows.length === 0)  {
            return null
        }

        const product: ProductType = rows[0]
        const newProduct =  new Product(
            product.product_id,
            product.name,
            product.quantity,
            product.price,
            product.unit,
            product.description,
            product.category_id
        )
        product.image && newProduct.setImageArray([product.image])
        return newProduct
    
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