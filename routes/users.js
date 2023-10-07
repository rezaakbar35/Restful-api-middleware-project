/**
* @swagger
* components:
*   schemas:
*       Users:
*           type: object
*           required: 
*               - email
*               - gender
*               - password
*               - role
*           properties:
*               id:
*                   type: integer
*                   description: the unique code of the users
*               email:
*                   type: string
*                   description: the email of the users
*               gender:
*                   type: string
*                   description: the gender of the users
*               password:
*                   type: string 
*                   description: the user's password
*               role:
*                   type: string
*                   description: the role of the users
*           example:
*               id: 6     
*               email: loak5@nifty.com
*               gender: Female
*               password: 46sy8hp1eJ
*               role: Estimator
*/

/**
* @swagger
* tags:
*   name: Users
*   description: The users API documentation
* /users:
*   get:
*       summary: Query all list of users account *require authorization
*       tags: [Users]
*       requestBody:
*           required: false
*           content:
*               application/json:
*                   schema:
*                       $ref: '#/components/schemas/Users'
*       responses:
*           200:
*               description: All users queried. 
*               content: 
*                   application/json: 
*                       schema:
*                           $ref: '#/components/schemas/Users'
*           500:
*               description: Internal server error
*
* /users/login:
*   post:
*       summary: Login an existing user account
*       tags: [Users]
*       requestBody:
*           required: true
*           content:
*               application/json:
*                   schema:
*                       $ref: '#/components/schemas/Users'
*       responses:
*           200:
*               description: User successfully logged in. 
*               content: 
*                   application/json:  
*                       schema:
*                           $ref: '#/components/schemas/Users'
*           500:
*               description: Internal server error
* /users/register:
*   post:
*       summary: Register a new user account
*       tags: [Users]
*       requestBody:
*           required: true
*           content:
*               application/json:
*                   schema:
*                       $ref: '#/components/schemas/Users'
*       responses:
*           200:
*               description: Account registered, kindly log in with the new account
*           500:
*               description: Internal server error
*
* /users/verify/{token}:
*   post:
*       summary: Register a new user account
*       tags: [Users]
*       parameters:
*           - in: path
*             name: token
*             schema:
*               type: string
*             required: true
*             description: The code that acquired from login.
*       responses:
*           200:
*               description: Verification successful. You can use full features!
*           500:
*               description: Internal server error
*
*/

const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const pool = require('../query.js');
const { signToken } = require('../utils/auth.js');
const verify = require('../middleware/verify.js')

router.use(bodyParser.json());

function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
}

router.post('/login', (req, res, next) => {
    pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [req.body.email, req.body.password], (error, results) => {
        if (error) {
            console.log(req.body)
            return next(error);
        }

        if (results.rows.length === 1) {
            const token = signToken(results.rows[0]);
            res.header('Authorization', `Bearer ${token}`);

            res.json({
                token: token,
            });
        } else {
            res.status(401).json({
                message: 'Invalid credentials',
            });
        }
    });
});

router.post('/register', (req, res, next) => {
    pool.query('SELECT MAX(id) FROM users', (error, result) => {
        if (error) {
            return next(error);
        }

        const maxId = result.rows[0].max || 0;

        pool.query('INSERT INTO users ("id", "email", "gender", "password", "role") VALUES ($1, $2, $3, $4, $5);', [maxId + 1, req.body.email, req.body.gender, req.body.password, req.body.role], (error, results) => {
            if (error) {
                return next(error);
            }
            res.status(201).json({
                status: 'success',
                message: 'Account registered, kindly log in with the new account',
            });
        });
    });
});

router.get('/verify/:token', verify, (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Verification successful. You can use full features!'
    });
});

router.get('/', verify, (req, res) => {
    pool.query('SELECT * FROM users', (error, results) => {
        if (error) {
            throw error
        }
        res.json(results.rows)
    })
})

router.get('/paginate', verify, (req, res) => {
    const page = req.query.page;
    const limit = req.query.limit;

    const offset = (page - 1)*limit

    pool.query('SELECT * FROM users LIMIT $1 OFFSET $2', [limit, offset], (error, results) => {
        if (error) {
            throw error
        }
        res.json(results.rows)
    })
})

router.use(errorHandler);

module.exports = router;