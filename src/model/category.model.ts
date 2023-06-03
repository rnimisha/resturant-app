export interface CategoryType {
    category_id: number,
    category_name: string,
    image: string
}
class Category{

    category_id: number
    category_name: string
    image: string

    constructor(  category_id: number, category_name: string, image: string){
        this.category_id = category_id
        this.category_name = category_name
        this.image = image
    }
}

export default Category