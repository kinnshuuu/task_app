const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')

const app = express()

app.use(bodyParser.json());
app.use(cookieParser())
app.use(bodyParser.urlencoded({
    extended:true
}))

app.use(morgan('dev'))

const PORT = '8000';

const mongoString = 'mongodb://localhost:27017/taskApp';
mongoose.connect(mongoString).then(()=>console.log('conncted to db'))

const userRoutes = require('./routes/auth');
const taskRoutes = require('./routes/task')
const {isAuth} = require('./controllers/auth')

app.use('/auth',userRoutes)
app.use('/task',isAuth,taskRoutes)

app.get('/',(req,res)=>{
    res.status(200).json({
        success:true,
        message:'welcome to task app'
    })
})

app.listen(PORT, ()=>{
    console.log(`listening on http://localhost:${PORT}`);
})