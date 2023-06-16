import { Pool } from "pg"
import dotenv from 'dotenv'
dotenv.config()


    // host: 'host.docker.internal'
const pool: Pool = new Pool({
    host: 'localhost',
    user: process.env.DB_USER,
    port: 5432,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
})

export default pool