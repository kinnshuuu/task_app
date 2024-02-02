const express = require('express');
const {register , login,isAuth,logout} = require('../controllers/auth')

const authRouter = express.Router();

authRouter.route('/register').post(register)
authRouter.route('/login').post(login)
authRouter.route('/logout',isAuth).get(logout)

module.exports = authRouter