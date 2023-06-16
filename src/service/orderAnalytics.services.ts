import pool from "../db"


class OrderAnalyticsService{

    // total revenue made each month
    static getTotalOrderByMonth = async ( ): Promise<any> =>{

         const q = `SELECT ROUND(CAST(SUM(od.quantity * p.price) AS numeric), 2) AS total,
                        TO_CHAR(order_date, 'YYYY') AS year,
                        TO_CHAR(order_date, 'Month') AS month,
                        TO_CHAR(order_date, 'MM') AS mm
                    FROM orders o
                    JOIN order_detail od 
                    ON o.order_id = od.order_id
                    JOIN product p
                    ON od.product_id = p.product_id
                    WHERE TO_CHAR(order_date, 'YYYY') IN (TO_CHAR(now() - interval '1 year', 'YYYY'), TO_CHAR(now(), 'YYYY'))
                    GROUP BY year, month, mm
                    ORDER BY mm`
        
        const {rows} = await pool.query(q)

        if(rows.length=== 0) return  null

        return rows
    }


    static getRevenueByCategory = async ( ): Promise<any> =>{
        const q = `SELECT ROUND(CAST(SUM(od.quantity * p.price) AS numeric), 2) AS total, category_name
                    FROM order_detail od
                    JOIN product p
                    ON od.product_id = p.product_id
                    JOIN category c
                    ON c.category_id = p.category_id
                    GROUP BY category_name 
                    ORDER BY total desc`
        
        const {rows} = await pool.query(q)

        if(rows.length=== 0) return  null

        return rows
    }
}

export default OrderAnalyticsService