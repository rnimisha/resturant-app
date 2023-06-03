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

}

export default UserService