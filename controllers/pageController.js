const nodemailer = require("nodemailer"); 
const User = require('../models/User')
const Course = require('../models/Course')


exports.getIndexPage = async (req,res) => {
    console.log('welcome' , req.session.userID)
    
    const studentCount = await User.find({role:'student'}).countDocuments()
    const teacherCount = await User.find({role:'teacher'}).countDocuments()
    const courseCount = await Course.find().countDocuments()
    

    const last2course = await Course.find({}).sort('-dateCreated').limit(2)


    res.status(200).render('index', {
        page_name:'index',
        studentCount,
        teacherCount,
        courseCount,
        last2course
        })
}


exports.getAboutPage = (req,res) => {
    res.status(200).render(
        'about', {
        page_name:'about'
        })
}

exports.getRegisterPage = (req,res) => {
    res.status(200).render(
        'register', {
        page_name:'register'
        })
}

exports.getLoginPage = (req,res) => {
    res.status(200).render(
        'login', {
        page_name:'login'
        })
}

exports.getContactPage = (req,res) => {
    res.status(200).render(
        'contact', {
        page_name:'contact'
        })
}

exports.sendEmail = async (req,res) => {
  
    const outputMessage = ` 
    <h1> Message Details </h1>
    <ul>
        <li> Name: ${req.body.name} </li>
        <li> Email: ${req.body.email}  </li>
    </ul>
    <h1> Message </h1>
    <p> ${req.body.message}  </p>
    `
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: 'ahmettahaarslan1', // gmail account
          pass: testAccount.pass, // gmail password
        },
      });
    
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: "bar@example.com, baz@example.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
      });
    
      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    }
    
    
  