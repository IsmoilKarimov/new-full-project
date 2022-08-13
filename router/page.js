const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth')
const News = require('../model/news')

router.get('/',async(req,res)=>{ 
    let sliderNews = await News
    .find({slider:1,status:1})
    .limit(4)
    .sort({_id:-1})
    .select(['title','_id','img','createdAt','category','author'])
    .populate('author')
    .populate('category')
    .lean()

    sliderNews = sliderNews.map(slider =>{
        let newDate = new Date(slider.createdAt)
        slider.createdAt = `${newDate.getDate()}-${newDate.getUTCMonth()}-${newDate.getFullYear()}`
        console.log(newDate);
        return slider
    })

    res.render('front/index',{ 
        sliderNews
    })
})

router.get('/admin',auth,(req,res)=>{
    res.render('back/index',{
        layout: 'back',
        isAdmin:true
    }) 
})


module.exports = router