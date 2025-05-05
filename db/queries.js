// Connection Pool (what you query).
const pool = require('../Pool');

// QUERIES
async function create_account(username, email, hashedPassword, status = 'basic') {
    try {
        await pool.query(
            "INSERT INTO users (username, email, password, status) VALUES ($1, $2, $3, $4)",
            [username, email, hashedPassword, status]
        );
    } catch (err) {
        throw err; // Let the caller handle the error
    }
}

async function attempt_login(email, unhashedPassword){
    return;
}

module.exports = {
    create_account,
    attempt_login
}
