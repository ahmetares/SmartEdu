const User = require('../models/User')
const bcrypt = require('bcrypt')
const Category = require('../models/Category')
const Course = require('../models/Course')


exports.createUser = async (req,res) => {
    try{

    const user = await User.create(req.body)
    res.status(201).redirect('/login')
   
    }catch(error){
        res.status(400).json({
            status:'fail',
            error
        })
    }
}

exports.loginUser =  async (req,res) => {   
    try{
    const {email, password} = req.body

    const user = await User.findOne({email:email})
    //Hem await hem callback kullandığımızda mongo yeni sürümünde hata veriyor. O yüzden await ile once userı alıyoruz islemlerı sonra yapıyoruz
    if(user) {
        bcrypt.compare(password, user.password, (err,same) => {
            if(same) {
                //USER SESSION
                req.session.userID  = user._id

                res.status(200).redirect('/users/dashboard')
            }
        })
    }

   }catch(error){
        res.status(400).json({
            status:'fail',
            error
        })
    }
}

exports.logoutUser = (req,res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
}


exports.getDashboardPage = async (req,res) => {  //normalde pageControllerde olması gerekirdi ama Login ile girilebildiği için buraya yazıldı
    const user = await (await User.findOne({_id: req.session.userID})).populate('courses')
    const categories = await Category.find()
    const courses = await Course.find({user:req.session.userID})


    res.status(200).render(
        'dashboard', {
        categories,    
        page_name:'dashboard',
        user,
        courses
        })
}