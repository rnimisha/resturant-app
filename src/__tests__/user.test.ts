import supertest from 'supertest'
import app from '../app'
import UserService from '../service/user.services'
import User from '../model/user.model'
const request = supertest(app)


describe('Auth API Test', ()=>{

    describe('POST /auth/login', () => { 

        it('should throw error when email is not registered', async()=>{

            const userData = {
                email: 'mytestemail@gmail.com',
                password: 'Hello123'
            }

            UserService.loginUser = jest.fn().mockReturnValue(null)
            const response = await request.post('/auth/login').send(userData)
            
            expect(response.status).toBe(404)
            expect(response.body.fieldError[0].field).toBe('email')
                
        })


        it('should throw error when password does not match', async()=>{

            const userData = {
                email: 'momo@gmail.com',
                password: 'Hello123'
            }

            UserService.loginUser = jest.fn().mockReturnValue(new User(
                1,
                'momo@gmail.com',
                'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d',
                'momo',
                'nepal',
                '283839302939',
                'C'
            ))

            const response = await request.post('/auth/login').send(userData)
            
            expect(response.status).toBe(404)
            expect(response.body.fieldError[0].field).toBe('password')
                
        })


        it('should generate a token when credentials are valid', async()=>{

            const userData = {
                email: 'momo@gmail.com',
                password: 'momo'
            }

            UserService.loginUser = jest.fn().mockReturnValue(new User(
                1,
                'momo@gmail.com',
                '$2b$10$.SprikZWsudBBxs5Z/VK3Om8izzTIK5obD2EKKt3uK75wLrYoSudW',
                'momo',
                'nepal',
                '283839302939',
                'C'
            ))

            const response = await request.post('/auth/login').send(userData)
            
            expect(response.status).toBe(200)
            expect(response.body.success).toBe(true)
            expect(response.body.data.token).toBeDefined()

        })
     })

})