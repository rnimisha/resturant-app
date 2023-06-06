# Food Ordering App API

This project provides a RESTful API  for managing and processing food orders Node.js, Express, and PostgreSQL.

## Features

- CRUD operations for managing products
- User authentication and authorization using JWT
- Input validation using Joi
- Error handling and custom error classes
- Middleware for XSS protection and request validation
- Database integration with PostgreSQL
- Unit testing using Jest and Supertest



## Run Locally

Clone the repository
```bash
    git clone https://github.com/rnimisha/resturant-app.git
```

Create a .env file and setup env variables
```bash
PORT=PORT_NO
DB_USER=DB_USERNAME
DB_PASSWORD=DB_PASSWORD
DB_NAME= DB_NAME
SECRETKEY = TOKEN_KEY
```
Install the project dependencies

```bash
  npm install 
```
    
Build and Run the project 

```bash
  npm run build
  npm start
```

OR

Run the project in development mode

```bash
  npm run dev
```

Access the API documentation:

`http://localhost:3000/api-docs` to access the Swagger UI documentation.

![Sqagger UI](https://raw.githubusercontent.com/rnimisha/resturant-app/main/src/utils/demo/apidemo.gif)
