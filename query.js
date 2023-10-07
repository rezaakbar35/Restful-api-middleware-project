const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'movies',
    password: 'rezaakbar35',
    port: 5432
})

module.exports = pool