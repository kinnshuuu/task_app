const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    phone : {
        type:String,
        required:true
    },
    priority: {
        type:Number,
        required:true
    }
},{timestamps:true});

const user = mongoose.model('User',UserSchema)

module.exports = user