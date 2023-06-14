import {  Request, Response } from "express"
import PaymentService from "../service/payment.services";

class PaymentController {


    static createPaypalOrder = async (req: Request, res: Response) => {
        try {
            const order = await PaymentService.createOrder(req.body)
            res.json(order);
        } catch (err) {
            res.status(500).send((err as Error).message);
        }
    }

    static capturePaypalOrder = async (req: Request, res: Response) =>{
        const { orderID } = req.body;
        try {
            const captureData = await PaymentService.capturePayment(orderID);
            res.json(captureData);
        } catch (err) {
            res.status(500).send((err as Error).message);
        }
    }
}

export default PaymentController