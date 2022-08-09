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
        success: req.flash('success'),
        error: req.flash('error'),
        layout: 'auth',
        title: 'Tizimga kirish'
    })
})

router.post('/login',async(req,res)=>{
    let {login,password} = req.body
    const checkUser = await User.findOne({login}).lean()
    if(checkUser){
        const comparePass = await bcrypt.compare(password,checkUser.password)
        if(comparePass){
            req.session.user = {
                _id: checkUser._id,
                name: checkUser.name,
                login: checkUser.login,
                img: checkUser.img
            }
            req.session.isAuthed = true
            req.session.save((err)=>{
                if(err) throw err
                else res.redirect('/admin')
            })
        } else {
            req.flash('error','Mahfiy kalit noto`g`ri kiritildi!')
            res.redirect('/user/login')
        }
    }
    else {
        req.flash('error','Tizimda bunday foydalanuvchi mavjud emas!')
        res.redirect('/user/login')
    }
})

router.get('/reg',async(req,res)=>{
    res.render('back/user/signUp',{
        error: req.flash('error'),
        layout: 'auth',
        title: 'Ro`yhatdan o`tish'
    })
})

router.post('/reg',async(req,res)=>{
    let {name,login,password} = req.body
    let checkUser = await User.findOne({login})
    if(checkUser){
        req.flash('error','Bunday logindagi foydalanuvchimiz mavjud!')
        res.redirect('/user/reg')
    } else {
        let hashPassword = await bcrypt.hash(password,10)
        const newUser = await new User({name,login,password:hashPassword})
        await newUser.save()
        req.flash('success','Ro`yhatdan muvaffaqiyatli o`tildi!')
        res.redirect('/user/login') 
    }
})

module.exports = router