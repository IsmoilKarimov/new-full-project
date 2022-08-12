const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth')
const upload = require('../middleware/file')
const News = require('../model/news')
const Category = require('../model/category')
const Author = require('../model/author')
const News = require('../model/news')

router.get('/',auth,async(req,res)=>{
    const news = await News.find().lean()
    const categorie = await Category.find({status:1}).lean()
    const author = await Author.find({status:1}).lean()
    news.map(news =>{
        news.status = news.status == 1 ?'<span class="badge badge-primary">Faol</span>':'<span class="badge badge-danger">Nofaol</span>'
    })
    res.render('back/news/index',{
        title: 'Yangiliklar ro`yhati',
        news,
        isNews: true,
        layout: 'back',
        categorie,
        author
    })
})  

router.post('/',auth,upload.single('img'),async(req,res)=>{  
    let {name,status} = req.body    
    let img = 'no-image'
    status = status || 0
    if(req.file){                               
        img = req.file.path
    }
    let newNews = await new News({name,status,img})
    await newNews.save()
    req.flash('success','Yangi maqola qo`shildi!')
    res.redirect('/news')
})

router.post('/save',auth,upload.single('img'),async(req,res)=>{
    let {_id,name,status} =  req.body
    status = status || 0
    let news = {_id,name,status}
    if(req.file){
        news.img = req.file.path
    }
    await News.findByIdAndUpdate(_id,news)
    req.flash('success','Maqola ma`lumotlari yangilandi!')
    res.redirect('/news')
})

router.get('/delete/:id',auth,async(req,res)=>{
    let _id = req.params.id
    await News.findByIdAndRemove({_id})
    req.flash('success','Maqola bazadan o`chirildi!')
    res.redirect('/news')
})

router.get('/:id',async(req,res)=>{
    let _id = req.params.id
    let news = await News.findOne({_id}).lean()
    res.send(news)
})

router.get('/change/:id', async(req,res)=>{
    let _id = req.params.id
    let news = await News.findOne({_id})
    news.status = news.status == 0 ? 1 : 0
    await news.save()
    res.redirect('/news') 
})

module.exports = router