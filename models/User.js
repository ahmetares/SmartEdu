const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

//create a schema 
const userSchema = new Schema ({
    name: {
        type: String,
        unique:true,
        required:true
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type:String,
        required: true
    },

    role: {
        type: String,
        enum:['student', 'teacher', 'admin'],
        default: 'student'
    },

    courses:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Course'
      }]

})



userSchema.pre('save' , function (next){
    if (!this.isModified('password')) return next();


    const user = this;
    bcrypt.hash(user.password, 10, (err, hash) => {
        user.password = hash
        next()
    });
})



const User = mongoose.model('User' , userSchema)

module.exports = User