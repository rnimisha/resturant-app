type FieldError = {
    field: string,
    description: string
}
class CustomError extends Error{
    statusCode : number
    fieldError?: FieldError[]
    
    constructor(message:string, statusCode: number)
    {
        super(message)
        this.statusCode = statusCode
    }

    setFieldError(fieldError: FieldError[])
    {
        this.fieldError = fieldError
    }
}

export default CustomError