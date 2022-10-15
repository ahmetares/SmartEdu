const express = require('express')
const authController = require('../controllers/authController')
const authMiddleware = require('../middlewares/authMiddleware')
const { body } = require('express-validator');
const User = require('../models/User')

const router= express.Router()

 

router.route('/signup').post([
    body('name').not().isEmpty().withMessage('Lütfen isminizi girin'),
    
    body('email').not().isEmpty().withMessage('Lütfen geçerli bir Email girin')
    .custom((userEmail)=> {
        return User.findOne({email:userEmail}).then(user => {
            if(user){
                return Promise.reject('Bu email kullanılıyor')
            }
        })
    }),
    
    body('password').not().isEmpty().withMessage('Lütfen şifrenizi girin')

], authController.createUser)   // localhost:3000/users/signup
router.route('/login').post(authController.loginUser)
router.route('/logout').get(authController.logoutUser)
router.route('/dashboard').get(authMiddleware , authController.getDashboardPage)
router.route('/:id').delete(authController.deleteUser)


module.exports = router;