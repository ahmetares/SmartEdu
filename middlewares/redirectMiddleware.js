//EĞER GİRİŞ YAPTIĞI HALDE REGİSTER/LOGİN E GİTMEYE CALISIYORSA 


const User = require('../models/User')

module.exports  = (req, res, next) => {
        if(req.session.userID){
            return res.redirect('/')
        }
        next()

}

//ALTERNATIF
// module.exports = (req , res , next) => {
//     User.findById(req.session.userID , (err,user) => {
//         if(user) {
//         return res.redirect('/')
//      }
//      next()
 
//     }) 
//  }