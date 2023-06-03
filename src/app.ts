import express from 'express'
import bodyParser from 'body-parser'

import ProductRoute from './routes/product.routes'
import CategoryRoute from './routes/category.routes'
import UserRoute from './routes/user.routes'
import OrderRoute from './routes/order.routes'
import CartRoute from './routes/cart.routes'

import errorMiddleware from './middleware/error.middleware'
const app =   express()

app.use(bodyParser.json())
app.use('/products', ProductRoute)
app.use('/categories', CategoryRoute )
app.use('/auth', UserRoute)
app.use('/orders', OrderRoute)
app.use('/carts', CartRoute)

app.use(errorMiddleware)

export default app