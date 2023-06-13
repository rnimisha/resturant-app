
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import Order, { Products } from '../model/order.models'
dotenv.config()


class MailService{

    static sendOrderMail = async ( email: string, orderDetails: Order): Promise<string> => {

        const transporter = await nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'baejinator@gmail.com',
                pass: process.env.MAIL_PASS
            }
        })
        
        const prod = orderDetails.products as Products[]

        const total = prod.reduce((acc, current)=>{
            const tot = Number(current.price) * current.quantity
            acc += tot
            return acc
        },0)

        const htmltext = `
                    <html>
                        <head>
                        <style>
                            
                            .order-details {
                            margin-bottom: 20px;
                            }
                            .order-details h2 {
                            color: #fff;
                            }
                            .order-details p {
                            margin: 5px 0;
                            }
                            .product-list {
                            margin-bottom: 20px;
                            }
                            .product-list table {
                            width: 100%;
                            border-collapse: collapse;
                            }
                            .product-list th,
                            .product-list td {
                            padding: 10px;
                            border: 1px solid #FCE4B1;
                            }
                            .product-list th {
                            background-color: #FCE4B1;
                            }
                            .total {
                            font-weight: bold;
                            font-size: 28px;
                            }
                        </style>
                        </head>
                        <body>
                        <div class="order-details">
                            <div class="topper" style="background-color: #f0b53a;width: 100%;height: 80px;color: white;font-family: sans-serif;text-align: center;">
                                <h2 style="padding-top: 20px;">Order Confirmation</h2>
                            </div>
                            <p>Order ID: ${orderDetails.order_id}</p>
                            <p>Order Date: ${orderDetails.order_date}</p>
                        </div>

                        <div class="product-list">
                            <br>
                            <table>
                            <thead>
                                <tr>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- Loop over products and generate rows -->
                                ${prod
                                .map(
                                    (product) => `
                                <tr>
                                    <td>${product.name}</td>
                                    <td>${product.price}</td>
                                    <td>${product.quantity}</td>
                                    <td>${Number(product.price) * product.quantity}</td>
                                </tr>
                                `
                                )
                                .join('')}
                            </tbody>
                            </table>
                        </div>

                        <div class="total">
                            <p>Total: ${total}</p>
                        </div>
                        </body>
                    </html>
                    `;


        await transporter.sendMail({
            from: '"Tastelious" <baejinator@gmail.com>', 
            to: email, 
            subject: 'Order Placed',
            text: 'Order has been placed', 
            html: htmltext
        })

        return 'done'
    }
}

export default MailService