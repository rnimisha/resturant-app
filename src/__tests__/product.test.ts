import supertest from 'supertest'
import app from '../app'
const request = supertest(app)
import ProductService from '../service/product.services'
import UserMiddleware from '../middleware/user.middleware'

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
                console.log(response)

                expect(response.body.success).toBe(false);
                expect(response.status).toBe(404)

                expect(ProductService.deleteProduct).toHaveBeenCalledWith(product_id);
            })
        })
    })
})