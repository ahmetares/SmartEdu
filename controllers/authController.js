const User = require('../models/User')
const Category = require('../models/Category')
const Course = require('../models/Course')

const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator');


exports.createUser = async (req,res) => {
    try{

    const user = await User.create(req.body)
    res.status(201).redirect('/login')
   
    }catch(error){
        const errors = validationResult(req);
       // console.log(errors) // errors: [{ value: '',msg: 'lütfen isminizi girin',param: 'name',location: 'body'}]

       for (let i = 0; i < errors.array().length; i++) {
        req.flash("error" , ` ${errors.array()[i].msg}`)
        }

        res.status(400).redirect('/register')
    }
}

exports.loginUser =  async (req,res) => {   
    try{
    const {email, password} = req.body

    const user = await User.findOne({email:email})
    //Hem await hem callback kullandığımızda mongo yeni sürümünde hata veriyor. O yüzden await ile once userı alıyoruz islemlerı sonra yapıyoruz
    if(user) {
        bcrypt.compare(password, user.password, (err,same) => {
            if(same){
                //USER SESSION
                req.session.userID  = user._id

                res.status(200).redirect('/users/dashboard')
            }
            else{
                req.flash("error" , ` Hatalı şifre girişi`)
                res.status(400).redirect('/login')

            }
            
        })
    }
    else{
        req.flash("error" , `Böyle bir kullanıcı bulunamadı.`)
        res.status(400).redirect('/login')

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
    const users= await User.find({})

    res.status(200).render(
        'dashboard', {
        categories,    
        page_name:'dashboard',
        user,
        users,
        courses
        })
}

exports.deleteUser = async (req,res) => {
    try {
    await User.findByIdAndRemove(req.params.id)
    await Course.deleteMany({user:req.params.id}) //o öğretmen tarafından olusan kurslar

    req.flash('error', `Kullanıcı başarıyla silindi.`)
    res.redirect('/users/dashboard')

    }catch(error){
        res.status(400).json({
            status:'fail',
            error
        })
    }

}