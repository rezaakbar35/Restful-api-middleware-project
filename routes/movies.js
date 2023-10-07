/**
* @swagger
* components:
*   schemas:
*       Movies:
*           type: object
*           required: 
*               - title
*               - genres
*               - year
*           properties:
*               id:
*                   type: integer
*                   description: The unique code of the movie
*               title:
*                   type: string
*                   description: The title of the movie
*               genres:
*                   type: string
*                   description: The genre of the movie
*               year:
*                   type: integer
*                   description: The movie's release year
*           example:
*               id: 1          
*               title: Reckless
*               genres: Comedy
*               year: 2001
*/

/**
* @swagger
* tags:
*   name: Movies
*   description: The movies API documentation
* /movies:
*   get:
*       summary: Retrieve a list of movies *require authorization
*       tags: [Movies]
*       requestBody:
*           required: false
*           content:
*               application/json:
*                   schema:
*                       $ref: '#/components/schemas/Movies'
*       responses:
*           200:
*               description: List of movies successfully retrieved.
*               content: 
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/Movies'
*           500:
*               description: Internal server error

*   post:
*       summary: Add a new movie to the list *require authorization
*       tags: [Movies]
*       requestBody:
*           required: true
*           content:
*               application/json:
*                   schema:
*                       $ref: '#/components/schemas/Movies'
*       responses:
*           201:
*               description: Movie successfully added.
*               content: 
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/Movies'
*           500:
*               description: Internal server error

* /movies/{id}:
*   get:
*       summary: Retrieve a movie by its ID *require authorization
*       tags: [Movies]
*       parameters:
*           - in: path
*             name: id
*             schema:
*               type: integer
*             required: true
*             description: The unique code of the movie
*       responses:
*           200:
*               description: Movie successfully retrieved.
*               content: 
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/Movies'
*           404:
*               description: Movie not found
*           500:
*               description: Internal server error

*   put:
*       summary: Update a movie by its ID *require authorization
*       tags: [Movies]
*       parameters:
*           - in: path
*             name: id
*             schema:
*               type: integer
*             required: true
*             description: The unique code of the movie
*       requestBody:
*           required: true
*           content:
*               application/json:
*                   schema:
*                       $ref: '#/components/schemas/Movies'
*       responses:
*           200:
*               description: Movie successfully updated.
*               content: 
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/Movies'
*           404:
*               description: Movie not found
*           500:
*               description: Internal server error

*   delete:
*       summary: Delete a movie by its ID *require authorization
*       tags: [Movies]
*       parameters:
*           - in: path
*             name: id
*             schema:
*               type: integer
*             required: true
*             description: The unique code of the movie
*       responses:
*           200:
*               description: Movie successfully deleted.
*           404:
*               description: Movie not found
*           500:
*               description: Internal server error
*/

const express = require('express')
const router = express.Router()

const pool = require('../query.js')
const verify = require('../middleware/verify.js')

router.get('/', verify, (req, res) => {
    const page = req.query.page;
    const limit = req.query.limit;

    const offset = (page - 1)*limit

    if (!page || !limit) {
        pool.query('SELECT * FROM movies', (error, results) => {
            if (error) {
                throw error
            }
            res.json(results.rows)
        })
    } else {
        pool.query('SELECT * FROM movies LIMIT $1 OFFSET $2', [limit, offset], (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
            res.json(results.rows)
        })
    }
})

router.get('/:id', verify, (req, res) => {
    pool.query(`SELECT * FROM movies WHERE id = $1`,[req.params.id] ,(error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.json(results.rows)
    })
})

router.post('/', verify, async (req, res, next) => {
    try {
        const maxIdQueryResult = await pool.query('SELECT MAX(id) FROM users');
        const maxId = maxIdQueryResult.rows[0].max || 0; // Use 0 if there are no existing users

        await pool.query('INSERT INTO movies ("title", "genres", "year") VALUES ($1, $2, $3)', [req.body.title, req.body.genres, req.body.year]);

        res.status(201).json({
            status: 'success',
            message: 'Movie successfully added!',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });;
    }
});

router.put('/:id', verify, (req, res) => {
    pool.query('UPDATE movies SET title=$1, genres=$2, year=$3 WHERE id=$4', [req.body.title, req.body.genres, req.body.year, req.params.id], (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
            res.status(201).json({
                status: 'success',
                message: 'Movie ' + req.body.title + ' successfully updated',
            });
        }
    );
});

router.delete('/:id', verify, (req, res) => {
    pool.query(`DELETE FROM movies WHERE id = $1`,[req.params.id] , (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.status(201).json({
            status: 'success',
            message: 'movie successfully delete!'
        })
    })
})

module.exports = router