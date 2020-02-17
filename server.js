const express = require('express');
const bcrypt = require('bcrypt');

const server = express();
const users = require ('./data/models/usersModel');

server.use(express.json());
