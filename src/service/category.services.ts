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


    static postCategory = async (category: Category): Promise<Category | null> =>{

        const q = 'INSERT INTO CATEGORY(category_name, image) VALUES($1, $2) RETURNING *'

        const {rows} = await pool.query(q, [category.category_name, category.image])

        const category_id = rows[0].category_id

        if(!category_id) return null

        return new Category(
            category_id,
            category.category_name,
            category.image
        )
    }
}


export default CategoryService