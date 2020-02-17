const db = require('../dbConfig');

module.exports = {
    register,
    findUser,
    findUsers
}

function register(user) {
    return db('users')
        .insert(user);
}

function findUser(username) {
    return db('users')
        .select('id', 'username', 'password')
        .where({ username: username });
}

function findUsers() {
    return db('users')
        .select('id', 'username');
}