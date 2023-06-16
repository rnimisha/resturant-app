import pool from "../db"


class OrderAnalyticsService{

    static getTotalOrderByMonth = async (year: number ): Promise<any> =>{

         const q = `SELECT ROUND(CAST(SUM(od.quantity * p.price) AS numeric), 2) AS total,
                        TO_CHAR(order_date, 'YYYY') AS year,
                        TO_CHAR(order_date, 'Month') AS month,
                        TO_CHAR(order_date, 'MM') AS mm
                    FROM orders o
                    JOIN order_detail od 
                    ON o.order_id = od.order_id
                    JOIN product p
                    ON od.product_id = p.product_id
                    WHERE TO_CHAR(order_date, 'YYYY') = $1
                    GROUP BY year, month, mm
                    ORDER BY mm`
        
        const {rows} = await pool.query(q, [year])

        if(rows.length=== 0) return  null

        return rows
    }
}

export default OrderAnalyticsService