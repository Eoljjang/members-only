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

async function upgrade_user(email){
    try{
        const result = await pool.query(
            'UPDATE users SET status = $1 WHERE email = $2 RETURNING *',
            ['member', email]
        );
    }
    catch (err) {
        throw err;
    }
}

async function upgrade_to_admin(email) {
    try{
        const result = await pool.query(
            'UPDATE users SET status = $1 WHERE email = $2 RETURNING *',
            ['admin', email]
        );
    }
    catch (err) {
        throw err;
    }
}

async function post_message(user, messageTitle, messageContent){ // user is res.locals.currentUser object.
    const user_id = user.id;
    try{
        await pool.query(
            "INSERT INTO messages (title, message, created_by) VALUES ($1, $2, $3)",
            [messageTitle, messageContent, user_id]
        );
    }
    catch (err){
        throw err;
    }
}

async function get_messages() {
    try {
        const response = await pool.query(`
            SELECT
                messages.id,
                messages.title,
                messages.message,
                messages.timestamp,
                messages.created_by,
                users.username,
                users.id AS user_id
            FROM messages
            JOIN users ON messages.created_by = users.id
            ORDER BY messages.timestamp DESC;
        `);

        return response.rows;
    } catch (err) {
        throw err;
    }
}

async function delete_message(messageId) {
    try{
        await pool.query(`DELETE from messages where ID = $1`, [messageId]);
        console.log(`Deleted message with id: ${messageId}.`);
    }
    catch (err) {
        throw err;
    }
}

module.exports = {
    create_account,
    upgrade_user,
    post_message,
    get_messages,
    upgrade_to_admin,
    delete_message,
}
