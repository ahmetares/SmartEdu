const mongoose = require('mongoose')
const slugify = require('slugify')
const Schema = mongoose.Schema

//create a schema 
const categorySchema = new Schema ({
    name: {
        type: String,
        unique:true,
        required:true
    },

    slug: {
        type:String,
        unique:true
    }



})

categorySchema.pre('validate', function(next){
    this.slug=slugify(this.name , {
        lower:true,
        strict:true  // : ; falan olursa yoksay sadece stringleri al
    })
    next() //bir sonraki middleware a geçmesi için
})


const Category = mongoose.model('Category' , categorySchema)

module.exports = Category