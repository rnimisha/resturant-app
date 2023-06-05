import supertest from 'supertest'
import app from '../app'

const request = supertest(app)

describe('Product API Test', ()=>{

    describe('GET /products/:id ',  ()=>{

        it('should return a single product when id is valid', async ()=> {
            const product_id = 1
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
})