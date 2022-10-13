//EĞER GİRİŞ YAPMADIGI HALDE DASHBOARD'A GİTMEYE CALISIYORSA 


const User = require('../models/User')

module.exports = (req , res , next) => {
   User.findById(req.session.userID , (err,user) => {
       if(err || !user) {
       return res.redirect('/login')
    }
    next()

   }) 
}

//ALTERNATIF
// module.exports = (req, res, next) => {
//     if(!req.session.userID){
//         return res.redirect('/login')
//     }
//     next()
// }