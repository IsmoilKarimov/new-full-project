const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth')

router.get('/',(req,res)=>{
    res.render('front/index',{ 
         
    })
})

router.get('/admin',auth,(req,res)=>{
    res.render('back/index',{
        layout: 'back',
        isAdmin:true
    }) 
})


module.exports = router