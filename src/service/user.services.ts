import pool from "../db";
import User from "../model/user.model";


class UserService{

    static registerUser = async(user: User): Promise<User | null> =>{

        const q = 'INSERT INTO USERS(email, password, name, address, phone, status, role) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *'

        const {rows} = await pool.query(q, [user.email, user.password, user.name, user.address, user.phone, 'A', user.role])

        if(!rows[0]) return null

        return new User(
            rows[0].user_id,
            rows[0].email,
            rows[0].password,
            rows[0].name,
            rows[0].address,
            rows[0].phone,
            rows[0].role
        )

    }

    static checkUniqueUser = async(email: string): Promise<boolean> =>{

        const q = 'SELECT * FROM users where UPPER(email) = $1'

        const {rows} = await pool.query(q, [email.toUpperCase()])

        return rows.length === 0 ? true : false
    }

    static loginUser = async(email: string): Promise<User | null> =>{

        const q = 'SELECT * FROM USERS WHERE UPPER(email) = $1'

        const { rows } = await pool.query(q,  [email.trim().toUpperCase()])

        if(!rows[0]) return null

        return new User(
            rows[0].user_id,
            rows[0].email,
            rows[0].password,
            rows[0].name,
            rows[0].address,
            rows[0].phone,
            rows[0].role
        )
    }


    static getUserEmail = async(user_id : number): Promise<string | null> =>{
        const q = 'SELECT * FROM USERS WHERE user_id = $1'

        const { rows } = await pool.query(q,  [user_id])

        if(!rows[0]) return null

        return rows[0].email
    }

}

export default UserService