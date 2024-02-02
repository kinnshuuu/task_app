const jwt = require('jsonwebtoken')
const User = require('../models/user')
const jwtSecret = 'kinshuissexy'
const jwtExpriry = '1d'

const register = async (req, res) => {

    try {
        const { phone, priority } = req.body;


        if (!phone || !priority) {
            res.status(400).json({
                success: false,
                message: 'Please provide phone number / priority'
            })
            return
        }

        const user = await User.findOne({phone:phone});

        if (user) {
            res.status(400).json({
                success: false,
                message: 'User already exist'
            })
            return
        }
        const newUser = await User.create({ phone: phone, priority: priority });

        res.status(200).json({
            success: true,
            message: 'User registered successfully'
        })
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: err
        })
    }
}

const login = async (req, res) => {
    try {
        console.log(req.body)
        const { phone } = req.body

        if (!phone) {
            res.status(400).json(
                {
                    success: false,
                    message: "Please provide phone number"
                }

            )
            return
        }
        const user = await User.findOne({phone:phone});
        if (!user) {
            res.status(400).json(
                {
                    success: false,
                    message: "User not found"
                }
            )
            return
        }
        const token = jwt.sign({ userId: user._id, phone: user.phone }, jwtSecret, { expiresIn: jwtExpriry });
        res.cookie('token', token, { maxAge: 1000 * 60 * 60 * 24 })
        res.status(200).json({
            success: true,
            token: token,
            message: "Login Successful"
        })
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: err
        })
    }
}

const logout = async (_,res) => {
    res.clearCookie('token');
    res.status(200).json({
        success:true,
        message:"logged out successfully"
    })
}

const isAuth = async (req, res, next) => {
    let token;

    if (req.headers['token']) {
        token = req.headers['token']
    }
    else if (req.cookies.token) {
        token = req.cookies.token
    }

    if (!token) {
        res.status(403).json({
            success: false,
            message: 'User not authenticated',
        })
        return
    }

    const data = jwt.verify(token, jwtSecret)
    req.userId = data.userId
    req.phone = data.phone

    next();
}

module.exports = {register , login , isAuth,logout}