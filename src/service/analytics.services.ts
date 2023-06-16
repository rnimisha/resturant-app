import pool from "../db"


export interface CountType{
    name: string,
    total: number
}
class AnalyticsService{

    static getCountAnalytics = async ( ): Promise<CountType[] | null> =>{

        const q = `SELECT 'Products' AS name, COUNT(*) AS total FROM PRODUCT
                UNION
                SELECT 'Orders' AS name, COUNT(*) AS total FROM ORDERS
                UNION 
                SELECT 'Revenue' AS name,  ROUND(CAST(SUM(od.quantity * p.price) AS numeric), 2) AS total 
                FROM ORDER_Detail od
                JOIN product p
                ON p.product_id = od.product_id
                UNION
                SELECT 'Customers' AS name, COUNT(*) AS total FROM USERS WHERE STATUS = 'A' AND ROLE='C'`

        
        const {rows} = await pool.query(q)

        if(rows.length=== 0) return  null

        return rows
    }
}

export default AnalyticsService