const express = require('express')
const authRouter = express.Router()
const { login, register } = require('../controllers/auth');

// setting up the routes
authRouter.route('/register').post(register)
authRouter.route('/login').post(login)

module.exports = authRouter;