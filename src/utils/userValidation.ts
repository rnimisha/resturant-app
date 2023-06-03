import pool from "../db"

// validate email: returns 0 if user does not exist
export const checkUniqueEmail = async(email: string): Promise<number> =>{

    const user_email = email.trim().toUpperCase()
    const q = 'SELECT * FROM users where UPPER(email) = $1'

    const user = await pool.query(q, [user_email])

    return user.rows[0] ? 1 : 0
}


export const checkUniquePhone= async(phone: string): Promise<number> =>{

    const user_phone = phone.trim().toUpperCase()
    const q = 'SELECT * FROM users where UPPER(phone) = $1'

    const user = await pool.query(q, [user_phone])

    return user.rows[0] ? 1 : 0
}