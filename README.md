
# ✨ RestFUL API and Middleware Project ✨

This project focuses on the usage of HTTP request methods such as GET, POST, PUT, and DELETE. In its implementation, authentication and authorization systems are utilized with JSON Web Tokens (JWT). Additionally, pagination concepts are employed in the GET method, and API documentation is done using Swagger.

The result of this project is to display the database according to HTTP methods and authorization. Then, there is another result in the form of API documentation.



## 🛠️ Installation

There are several npm packages that will be used in this project, including express, pg, nodemon (optional), jsonwebtoken and swagger.

```bash
  npm install --save express
  npm install --save pg
  npm install -g nodemon
  npm install jsonwebtoken
  npm install swagger-ui-express swagger-jsdoc
```
    
## 📥 Import Database
Before entering the project, we need to import the database first.

You can download the database here: https://github.com/fathy17/dokumen-pembanding-2/blob/master/movies-database.sql

How to Import Database
1. Open pgadmin
2. Create database (example: movies)
3. Right click on the new database and choose restore
4. Select movies-database.sql and click restore
5. The database all set!
    
## ⚙️ How to Run Project
Before we run the project, make sure we have installed Postman. After installing Postman, the next step is to run this project directly.
```bash
node index.js
```
### Authentication and Authorization 
The first step is to register, log in, and verify the user so that we can access the HTTP methods on the /movies route. You can use random generate email and password for example
```bash
/POST http://localhost:3000/users/register

{
    "email": "askdjhf@gmail.com",
    "gender": "Male",
    "password": "skdfjhsdf4",
    "role": "Programmer"
}
```
After receiving a successful message during registration, the next step is to proceed with the login.
```bash
/POST http://localhost:3000/users/login

{
    "email": "askdjhf@gmail.com",
    "password": "skdfjhsdf4"
}
```
After successfully login, you will receive a token. Copy the token, and paste it into the URL as shown below.
```bash
/GET http://localhost:3000/users/verify/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAyLCJlbWFpbCI6ImRrc2pmaGtzamRmaHNkZkBnbWFpbC5jb20iLCJnZW5kZXIiOiJNYWxlIiwicGFzc3dvcmQiOiJzc2FmZGtqaHNhZGtmNzQiLCJyb2xlIjoiUHJvZ3JhbW1lciIsImlhdCI6MTY5NjY4OTk0MywiZXhwIjoxNjk2NjkzNTQzfQ.1y3yew8e7lyn_wzwYWv2grz7cddurWKUdHHMcgYQdmE
```
When you are verified, you will receive a message that you can access the full features of this project.

### RestFUL API Method
there are 5 HTTP Method that can be used in this project, such as:
1. /GET /movies
2. /GET /movies/:id
3. /POST /movies
4. /PUT /movies/:id
5. /DELETE /movies/:id

The first case is /GET /movies, where this method can display queries for all movies with or without pagination to limit movie queries.

```bash
/GET http://localhost:3000/movies
                or
/GET http://localhost:3000/movies?page=1&limit=10
```

The second case is /GET /movies/:id to display a specific movie query.
```bash
/GET http://localhost:3000/movies/35
```

The third case is /POST /movies to add a movie to the database.
```bash
/POST http://localhost:3000/movies/

{
    "title": "My Hero Academia",
    "genres": "Action",
    "year": "2022",
}
```

The fourth case is /PUT /movies/:id to update a specific movie based on the obtained id.
```bash
/PUT http://localhost:3000/movies/101

{
    "title": "My Hero Academia",
    "genres": "Action",
    "year": "2023",
}
```

The fifth case is /DELETE /movies/:id to delete a specific movie based on the id.
```bash
/DELETE http://localhost:3000/movies/101
```




## Documentation

As mentioned at the beginning, the documentation here uses Swagger. Therefore, to access the documentation, you can simply access the following URL.
```bash
http://localhost:3000/api-docs
```

