const {Router} = require('express')
const router = Router()

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



module.exports = router