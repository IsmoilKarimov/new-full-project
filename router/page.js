const {Router} = require('express')
const router = Router()

router.get('/',(req,res)=>{
    res.render('index',{ 

    })
})

router.get('/admin', (req,res)=>{
    res.render('dashboard',{
        layout: 'back'
    })
})

router.get('/contact', (req,res)=>{
    res.render('page/contact',{
        isContact:true
    })
})


module.exports = router