const {Router} = require('express')
const router = Router()
const User = require('../model/user')
const bcrypt = require('bcryptjs')

router.get('/',async(req,res)=>{
    res.render('back/user/index',{
        layout: 'back'
    })
})

router.get('/login',async(req,res)=>{
    res.render('back/user/signIn',{
        layout: 'auth',
        title: 'Tizimga kirish'
    })
})

router.get('/reg',async(req,res)=>{
    res.render('back/user/signUp',{
        layout: 'auth',
        title: 'Ro`yhatdan o`tish'
    })
})

router.post('/reg',async(req,res)=>{
    let {name,login,password} = req.body
    let checkUser = await User.findOne({login})
    if(checkUser){
        res.redirect('/user/login')
    } else {
        let hashPassword = await bcrypt.hash(password,10)
        const newUser = await new User({name,login,password:hashPassword})
        await newUser.save()
        res.redirect('/user/login') 
    }
})

module.exports = router