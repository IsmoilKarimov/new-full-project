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
        return slider
    })

    let recentNews = await News
    .find({status:1})
    .sort({_id:-1})
    .limit(3)
    .populate('author')
    .populate('category')
    .select(['title','_id','img','createdAt','category','author','description'])
    .lean()
    recentNews = recentNews.map(slider =>{
        let newDate = new Date(slider.createdAt)
        slider.createdAt = `${newDate.getDate()}-${newDate.getUTCMonth()}-${newDate.getFullYear()}`
        return slider
    })
   
    let recentSideNews = await News
    .find({status:1})
    .sort({_id:-1})
    .skip(3)
    .limit(3)
    .populate('author')
    .populate('category')
    .select(['title','_id','img','createdAt','category','author','description'])
    .lean()
    recentSideNews = recentSideNews.map(slider =>{
        let newDate = new Date(slider.createdAt)
        slider.createdAt = `${newDate.getDate()}-${newDate.getUTCMonth()}-${newDate.getFullYear()}`
        return slider
    })

    let bigPopular = await News.findOne({bigpopular:1,status:1})
    .sort({_id:-1})
    .select(['_id','createdAt','hashList','title','description','img'])
    .lean()
    
    let bigPopDate = new Date(bigPopular.createdAt)
        bigPopular.createdAt = `${bigPopDate.getDate()}-${bigPopDate.getUTCMonth()}-${bigPopDate.getFullYear()}`

    
    let popularNews = await News.find({status:1,popular:1})
    .where({_id: {$ne: bigPopular._id}})
    .limit(4)
    .select(['_id','createdAt','hashList','title','img'])                               
    .sort({_id:-1})
    .lean()
    popularNews = popularNews.map(popularDate=>{
        let newDate = new Date(popularDate.createdAt)
        popularDate.createdAt = `${newDate.getDate()}-${newDate.getUTCMonth()}-${newDate.getFullYear()}` 
        return popularDate
    })

    let viewNews = await News.find({status:1})
    .limit(4)
    .sort({view:-1})
    .populate('category')
    .populate('author')
    .select(['_id','createdAt','hashList','title','img','category','author'])
    .lean()

    viewNews = viewNews.map(mostView=>{
        let newDate = new Date(mostView.createdAt)
        mostView.createdAt = `${newDate.getDate()}-${newDate.getUTCMonth()}-${newDate.getFullYear()}` 
        return mostView
    })

    let hotNews = await News.findOne({status:1,hot:1})
    .sort({_id:-1})
    .populate('author')
    .populate('category')
    .select(['_id','hashList','img','category','author','title','description','createdAt'])
    .lean()

    let hotDate = new Date(hotNews.createdAt)
    hotNews.createdAt = `${hotDate.getDate()}-${hotDate.getUTCMonth()}-${hotDate.getFullYear()}`
       
    let topWeek = await News.find({status:1,topweek:1})
    .limit(3)
    .sort({_id:-1})
    .populate('author')
    .populate('category')
    .select(['_id','topweek','img','category','author','title','description','createdAt'])
    .lean()

    topWeek = topWeek.map(week =>{
        let topDate = new Date(week.createdAt)
        week.createdAt = `${topDate.getDate()}-${topDate.getUTCMonth()}-${topDate.getFullYear()}`
        return week
    })

    res.render('front/index',{ 
        sliderNews,
        recentNews,
        recentSideNews,
        bigPopular,
        popularNews,
        viewNews,
        hotNews,
        topWeek
    })
})

router.get('/admin',auth,(req,res)=>{
    res.render('back/index',{
        layout: 'back',
        isAdmin:true
    }) 
})


module.exports = router