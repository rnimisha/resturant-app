export interface UserType{
    user_id: number
    email: string
    password: string
    name: string
    address: string
    phone: string
    role: string
}

class User{
    user_id: number
    email: string
    password: string
    name: string
    address: string
    phone: string
    role: string

    constructor(user_id: number,  email: string, password: string, name: string, address: string, phone: string, role: string){
        this.user_id = user_id
        this.email = email 
        this.password = password
        this.name = name
        this.address = address
        this.phone = phone
        this.role = role
    }
}

export default User