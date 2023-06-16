import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

import YAML from 'yamljs'
import swaggerUi from 'swagger-ui-express'
const swaggerDocs = YAML.load('src/swagger/swagger.yaml');

import ProductRoute from './routes/product.routes'
import CategoryRoute from './routes/category.routes'
import UserRoute from './routes/user.routes'
import OrderRoute from './routes/order.routes'
import CartRoute from './routes/cart.routes'
import PaymentRoute from './routes/payment.routes'
import AnalyticsRoute from './routes/analytics.routes'

import errorMiddleware from './middleware/error.middleware'
const app =   express()

app.use(bodyParser.json())
app.use(cors())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.use('/products', ProductRoute)
app.use('/categories', CategoryRoute )
app.use('/auth', UserRoute)
app.use('/orders', OrderRoute)
app.use('/carts', CartRoute)
app.use('/payment', PaymentRoute)
app.use('/analytics', AnalyticsRoute)


app.use(errorMiddleware)

export default app