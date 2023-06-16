import pool from "../db"


export interface CountType{
    name: string,
    total: number
}
class AnalyticsService{

    static getCountAnalytics = async ( ): Promise<CountType[] | null> =>{

        const q = `SELECT 'product' AS name, COUNT(*) AS total FROM PRODUCT
                    UNION
                    SELECT 'orders' AS name, COUNT(*) AS orders FROM ORDERS
                    UNION 
                    SELECT 'revenue' AS name, SUM(od.quantity * p.price  ) AS orders 
                    FROM ORDER_Detail od
                    JOIN product p
                    ON p.product_id = od.product_id`

        
        const {rows} = await pool.query(q)

        if(rows.length=== 0) return  null

        return rows
    }
}

export default AnalyticsService