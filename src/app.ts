import express from 'express'
import bodyParser from 'body-parser'

import ProductRoute from './routes/product.routes'
import errorMiddleware from './middleware/error.middleware'
const app =   express()

app.use(bodyParser.json())
app.use('/products', ProductRoute)

app.use(errorMiddleware)

export default app