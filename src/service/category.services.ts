import pool from "../db";
import Category, { CategoryType } from "../model/category.model";


class CategoryService{

    static getAllCategory = async(): Promise<CategoryType[] | null> =>{

        const q = 'SELECT * FROM category'
        const {rows} = await pool.query(q)

        if ( rows.length === null) return null

           const categories: Category[] = rows.map((category: Category)=> new Category(
            category.category_id,
            category.category_name,
            category.image
        ))

        return categories
    }
}


export default CategoryService