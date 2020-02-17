const express = require('express');
const bcrypt = require('bcrypt');
const morgan = require('morgan');
const helmet = require('helmet');

const server = express();
const users = require('./data/models/usersModel');

server.use(helmet());
server.use(morgan('dev'));
server.use(express.json());


server.get('/', (req, res) => {
    res.send(`<h2>jeffreyo3's server is alive</h2>`);
});


server.post('/api/register', (req, res) => {
    const user = req.body;

    const hash = bcrypt.hashSync(user.password, 10);

    user.password = hash;

    users.register(user)
        .then(user => {
            res.status(201).json(user);
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        })
});

server.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    users.findUser(username)
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                res.status(200).json({ message: `Welcome ${user.username}!` });
            } else {
                res.status(500).json({ error: err.message, message: username });
            }
        })
});

server.get('/api/users', (req, res) => {
    users.findUsers()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        })
});

module.exports = server;