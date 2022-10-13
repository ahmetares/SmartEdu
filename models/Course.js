const mongoose = require('mongoose')
const slugify = require('slugify')
const Schema = mongoose.Schema

//create a schema 
const courseSchema = new Schema ({
    name: {
        type: String,
        unique:true,
        required:true
    },

    description: {
        type:String,
        required: true,
        trim:true //başta e sondaki boşlukları silme
    },

    dateCreated: {
        type: Date,
        default: Date.now
    },

    slug: {
        type:String,
        unique:true
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Category'
    },

    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }



})

courseSchema.pre('validate', function(next){
    this.slug=slugify(this.name , {
        lower:true,
        strict:true  // : ; falan olursa yoksay sadece stringleri al
    })
    next() //bir sonraki middleware a geçmesi için
})


const Course = mongoose.model('Course' , courseSchema)

module.exports = Course