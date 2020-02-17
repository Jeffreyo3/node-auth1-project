const express = require('express');
const bcrypt = require('bcrypt');
const morgan = require('morgan');
const helmet = require('helmet');
const session = require('express-session');

const server = express();
const users = require('./data/models/usersModel');

// Cookie config
const sessionConfig = {
    name: 'userCookie',
    secret: 'secretsecretsarenofun',
    cookie: {
        maxAge: 1000 * 60 * 60,
        secure: false,
        httpOnly: true
    },
    resave: false,
    saveUninitialized: false
}

server.use(helmet());
server.use(morgan('dev'));
server.use(express.json());
server.use(session(sessionConfig));

// Validation middleware
function validateUser(req, res, next) {
    if (req.session && !!req.session.user) {
        next();
    } else {
        res.status(400).json({ message: 'You shall not pass!' })
    }
}


// Alive messages
server.get('/', (req, res) => {
    res.send(`<h2>jeffreyo3's server is alive</h2>`);
});
server.get('/api', (req, res) => {
    res.send(`<h2>jeffreyo3's api server is alive</h2>`);
});


// Register user, applying hash, requiring username & password
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

// Login user requiring username & password. Check if password hashed matches stored hash
server.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    users.findUser(username)
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                req.session.user = user;
                res.status(200).json({ message: `Welcome ${user.username}!` });
            } else {
                res.status(500).json({ error: err.message, message: username });
            }
        })
});

// Let logged in user see list of all users (need validation middleware)
server.get('/api/users', validateUser, (req, res) => {

    users.findUsers()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        })
});

module.exports = server;