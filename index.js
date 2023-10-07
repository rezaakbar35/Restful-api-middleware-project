const express = require('express');
const bodyParser = require('body-parser');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const morgan = require('morgan');

const app = express();

const movies = require('./routes/movies.js');
const users = require('./routes/users.js');

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Middleware Project API Documentation",
            version: "0.1.0",
            description: "This documentation made with swagger. The API itself are made with Express JS",
        },
        servers: [
            {
                url: 'http://localhost:3000',
            }
        ]
    },
    apis: ['./routes/*']
}

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(bodyParser.json());
app.use(morgan('tiny'));

app.use('/movies', movies);
app.use('/users', users);

app.listen(3000, () => {
    console.log('Connected to the server')
})