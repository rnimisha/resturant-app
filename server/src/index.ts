import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
dotenv.config()

import ProductRoute from './routes/product.routes'
const app =   express()

app.use(bodyParser.json())
app.use('/products', ProductRoute)


 app.listen(process.env.PORT, ()=>{
    console.log(`server listening to port ${process.env.PORT}`)
 }) 