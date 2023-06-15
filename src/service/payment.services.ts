import axios, { type AxiosResponse, type AxiosError } from 'axios';
import dotenv from 'dotenv';
import Order from '../model/order.models';
dotenv.config();

const { CLIENT_ID, APP_SECRET } = process.env;
const base = 'https://api-m.sandbox.paypal.com';
class PaymentService{

  static  generateAccessToken = async ()=> {
    const auth = Buffer.from(CLIENT_ID + ':' + APP_SECRET).toString('base64');

    try {
      const response: AxiosResponse = await axios.post(
        `${base}/v1/oauth2/token`,
        'grant_type=client_credentials',
        {
          headers: {
            Authorization: `Basic ${auth}`,
          },
        }
      );
      return response.data.access_token;
    } catch (error) {
      throw new Error((error as AxiosError).message);
    }
  }

  static handleResponse = async (response: AxiosResponse) =>{
    if (response.status === 200 || response.status === 201) {
      return response.data;
    }

    throw new Error(response.statusText);
  }

  static createOrder = async (total: number): Promise<any>=> {
      const accessToken = await this.generateAccessToken();
      const url = `${base}/v2/checkout/orders`;

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      };

      try {
        const response: AxiosResponse = await axios.post(
          url,
          {
            intent: 'CAPTURE',
            purchase_units: [
              {
                amount: {
                  currency_code: 'USD',
                  value: total,
                },
              },
            ],
          },
          { headers }
        );
        return this.handleResponse(response);
      } catch (error) {
        throw new Error((error as AxiosError).message);
      }
    }

    static capturePayment = async(orderId: string): Promise<any> =>{
      const accessToken = await this.generateAccessToken();
      const url = `${base}/v2/checkout/orders/${orderId}/capture`;

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      };

      try {
        const response: AxiosResponse = await axios.post(url, {}, { headers });
        return this.handleResponse(response);
      } catch (error) {
        throw new Error((error as AxiosError).message);
      }
    }

}

export default PaymentService