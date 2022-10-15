const express=require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const methodOverride = require('method-override')


const pageRouter = require('./routes/pageRoute')
const courseRouter = require('./routes/courseRoute')
const categoryRouter = require('./routes/categoryRoute')
const userRouter = require('./routes/userRoute')

const app = express()



 //CONNECT DB
 const mongoAtlasUri =
  'mongodb+srv://ahmetares:12345@cluster0.8qfcqbi.mongodb.net/smartedu-db';
try {
  // Connect to the MongoDB cluster
  mongoose.connect(
    mongoAtlasUri,
    { useNewUrlParser: true, useUnifiedTopology: true},
    () => console.log(' Mongoose is connected'));
} catch (e) {
  console.log('could not connect');
}
 


//TEMPLATE ENGINE
app.set('view engine', 'ejs')


 

//GLOBAL VARIABLE

global.userIn = null




//MIDDLEWARES

app.use(express.static('public'))
app.use(express.json()) // for parsing application/json   //for post
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-
app.use(session({
  secret: 'my_keyboard_cat',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl:'mongodb+srv://ahmetares:12345@cluster0.8qfcqbi.mongodb.net/smartedu-db'}),
}))
app.use(flash());
app.use((req,res,next) => {
  res.locals.flashMessages = req.flash()
  next()
})
app.use(methodOverride('_method', {
  methods: ['POST' , 'GET'],
})
)






//ROUTES
app.use('*' , (req,res,next) => {   //* = hangi istek gelirse gelsin
  userIN = req.session.userID
  next()
})
app.use('/',pageRouter) //pcattakinin aksine birden cok modelimiz oldugu ıcın boyle yapıyoruz
app.use('/courses', courseRouter)
app.use('/categories', categoryRouter)
app.use('/users', userRouter)






//SERVER
const port = 3000;

app.listen(port, () => {
    console.log(`app started at ${port}`)
})
