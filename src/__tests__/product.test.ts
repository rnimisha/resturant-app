import supertest from 'supertest'
import app from '../app'
const request = supertest(app)
import ProductService from '../service/product.services'
import Product from '../model/product.model'

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo1LCJlbWFpbCI6Im1vbW9AZ21haWwuY29tIiwicm9sZSI6IkMiLCJpYXQiOjE2ODU5NjU0NDF9.EMgaXowgVTNCZcFf0do7bbrb9U8YqTlEq8weEoV1CxY'

describe('Product API Test', ()=>{

    afterEach(() => {
        jest.clearAllMocks(); 
    });

    describe('GET /products/:id ',  ()=>{

        it('should return a single product when id is valid', async ()=> {
            const product_id = 2
            const response = await request.get(`/products/${product_id}`)

            expect(response.status).toBe(200)
            expect(response.body.data.product_id).toBe(product_id)
        })

        it('should throw error 404 if product with id is not available', async ()=>{
            const product_id = 0
            const response = await request.get(`/products/${product_id}`)
            expect(response.status).toBe(404)
            expect(response.body).toEqual({
                success: false,
                msg: 'Product Not Found',
                fieldError: []
            })
        })
        

    })

    describe('GET /products', ()=>{

        it('should return all products', async()=>{
            const response = await request.get(`/products`)
            expect(response.status).toBe(200)
        })
    })

    describe('DELETE /products', ()=>{

        describe('given the user is logged in ', ()=>{
            
            it('should delete product if product with id is available', async ()=>{

                const product_id = 1;

                ProductService.deleteProduct = jest.fn().mockReturnValue('deleted');

                const response = await request
                .delete(`/products/${product_id}`)
                .set('Authorization', `Bearer ${token}`)


                expect(response.status).toBe(200)
                expect(response.body.success).toBe(true);
                expect(response.body.data).toEqual([]);

                expect(ProductService.deleteProduct).toHaveBeenCalledWith(product_id);
            })

            it('should throw error if product with id is not available', async ()=>{

                const product_id = 0;

                ProductService.deleteProduct = jest.fn().mockReturnValue('no product');

                const response = await request
                .delete(`/products/${product_id}`)
                .set('Authorization', `Bearer ${token}`)

                expect(response.body.success).toBe(false);
                expect(response.status).toBe(404)

                expect(ProductService.deleteProduct).toHaveBeenCalledWith(product_id);
            })
        })
    })

    describe('POST /products' , ()=>{
        describe('given the user is logged in ', ()=>{

            it('should be success when all fields are provided', async()=>{

                const productData = {
                    name: 'Test Product',
                    quantity: 10,
                    price: 120,
                    description: 'This is a test product',
                    unit: 'pcs',
                    category_id: 1,
                }

                ProductService.postProduct = jest.fn().mockReturnValue( new Product(
                                                                            100,
                                                                            'Test Product',
                                                                            10,
                                                                            120,
                                                                            'pcs',
                                                                            'This is a test product',
                                                                            1
                                                                        ));

                 const response = await request
                    .post('/products')
                    .set('Authorization', `Bearer ${token}`)
                    .field('name', productData.name)
                    .field('quantity', productData.quantity)
                    .field('price', productData.price)
                    .field('description', productData.description)
                    .field('unit', productData.unit)
                    .field('category_id', productData.category_id)
                    .attach('image', '/Users/nimisha/Documents/web/resturant-app/src/uploads/1685793587453-698849614-PngItem_5228598.png')
                    
                    expect(response.status).toBe(201)
                    expect(ProductService.postProduct).toHaveBeenCalled();
            })


             it('should throw error if price is less than 0', async()=>{

                const productData = {
                    name: 'Test Product',
                    quantity: 10,
                    price: -1,
                    description: 'This is a test product',
                    unit: 'pcs',
                    category_id: 1
                }

                  const response = await request
                    .post('/products')
                    .set('Authorization', `Bearer ${token}`)
                    .field('name', productData.name)
                    .field('quantity', productData.quantity)
                    .field('price', productData.price)
                    .field('description', productData.description)
                    .field('unit', productData.unit)
                    .field('category_id', productData.category_id)
                    .attach('image', '/Users/nimisha/Documents/web/resturant-app/src/uploads/1685793587453-698849614-PngItem_5228598.png')
                    
                    expect(response.status).toBe(400)
                    expect(response.body.fieldError[0].field).toBe('price')

             })

        })
    })
})