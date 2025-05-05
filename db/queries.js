// Connection Pool (what you query).
const pool = require('../Pool');

// QUERIES
async function someQuery(){
    await pool.query();
}

module.exports = {
    someQuery
}
