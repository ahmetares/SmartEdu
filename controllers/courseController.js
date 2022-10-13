const Course = require('../models/Course')
const Category = require('../models/Category')
const User = require('../models/User')



exports.createCourse = async (req,res) => {
    try{

    const course = await Course.create({
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        user: req.session.userID
    })
   
    res.status(201).redirect('/courses')

    }catch(error){
        res.status(400).json({
            status:'fail',
            error
        })
    }
}

exports.getAllCourses = async (req,res) => {
    try{


    const categorySlug =  req.query.categories
    //console.log(categorySlug) http://localhost:3000/courses?categories=programming => console.log == programming
    const categoryy = await Category.findOne({slug:categorySlug})

    let filter = {}
    if(categorySlug) {
      filter = {category:categoryy._id}   //ilk category Course'dan
    }
    
    const courses = await Course.find(filter).sort('-dateCreated').populate('user') 
    const categories = await Category.find()

    res.status(200).render('courses',{
        courses,
        categories,
        page_name:'courses'
    })

    }catch(error){
        res.status(400).json({
            status:'fail',
            error
        })
    }
}


exports.getCourse = async (req,res) => {
    try{

    const course = await (await Course.findOne({slug:req.params.slug})).populate('user')  
    //course bilgileri useri de ıcerdıgı ıcın populate ıle coursedan userın bilgilerinede erişebileceğiz

    res.status(200).render('course',{
        course,
        page_name:'courses'
    })

    }catch(error){
        res.status(400).json({
            status:'fail',
            error
        })
    }
}

exports.enrollCourse = async (req, res) => {
    try {    
      const user = await User.findById(req.session.userID);
      await user.courses.push(await Course.findById({_id:req.body.course_id})); //1 saat
      await user.save();
  
      res.status(200).redirect('/users/dashboard');
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        error,
      });
    }
  };