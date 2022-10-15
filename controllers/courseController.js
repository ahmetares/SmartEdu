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
    
    req.flash("success" , ` ${course.name} oluşturuldu!`)
    res.status(201).redirect('/courses')

    }catch(error){
        req.flash("error" , `Kurs oluşturulamadı: ${error}`)
        res.status(400).redirect('/courses')
    }
}

exports.getAllCourses = async (req,res) => {
    try{

    //console.log(categorySlug) http://localhost:3000/courses?categories=programming => console.log == programming
    const categorySlug =  req.query.categories
    const categoryy = await Category.findOne({slug:categorySlug})

    const query = req.query.search
    

    let filter = {}

    if(categorySlug) {
      filter = {category:categoryy._id}   //ilk category Course'dan
    }

    if(query){
       filter = {name:query}  
    }

    if(!query && !categorySlug){
        filter.name='',
        filter.category= null
    }
    
    const courses = await Course.find({
      $or:[
          {name: {$regex: '.*' + filter.name + '.*' , $options: 'i'}},
          {category: filter.category}
      ]  
    })
    .sort('-dateCreated')
    .populate('user') 
   
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
    const user = await User.findById(req.session.userID)
    const course = await (await Course.findOne({slug:req.params.slug})).populate('user')  
    //course bilgileri useri de ıcerdıgı ıcın populate ıle coursedan userın bilgilerinede erişebileceğiz

    res.status(200).render('course',{
        user,
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

  exports.releaseCourse = async (req, res) => {
    try {    
      const user = await User.findById(req.session.userID);
      await user.courses.pull(await Course.findById({_id:req.body.course_id})); 
      await user.save();
  
      res.status(200).redirect('/users/dashboard');
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        error,
      });
    }
  };

  exports.deleteCourse = async (req,res) => {
    try{
    
     const course = await Course.findByIdAndRemove(req.params.id)
      req.flash('error', `${course.name} başarıyla silindi`)
      res.redirect('/users/dashboard')
    }catch(error){
      res.status(400).json({
        status:'fail',
        error,
      })
    }

  }
    exports.updateCourse = async (req,res) => {
      
      try{
      
        const course = await Course.findById(req.params.id)

        course.name = req.body.name
        course.description = req.body.description 
        course.category = req.body.category 
        course.save()

        req.flash('success', `Kurs başarıyla güncellendi`)
        res.redirect('/users/dashboard')
      }catch(error){
        res.status(400).json({
          status:'fail',
          error,
        })
      }
  }