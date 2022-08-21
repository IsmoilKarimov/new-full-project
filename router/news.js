const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth')
const upload = require('../middleware/file')
const News = require('../model/news')
const Category = require('../model/category')
const Author = require('../model/author')
const category = require('../model/category')

router.get('/',auth,async(req,res)=>{
    let news = await News
    .find()
    .sort({_id:-1})
    .populate('category')
    .populate('author')
    .lean()
    let category = await Category.find({status:1}).lean()
    let author = await Author.find({status:1}).lean()
    news.map(newsEl =>{
        newsEl.status = newsEl.status == 1 ?'<span class="badge badge-primary">Faol</span>':'<span class="badge badge-danger">Nofaol</span>'
        newsEl.popular = newsEl.popular == 1 ?'<span class="badge badge-primary">Ha</span>':'<span class="badge badge-danger">Yo`q</span>'
        newsEl.bigpopular = newsEl.bigpopular == 1 ?'<span class="badge badge-primary">Ha</span>':'<span class="badge badge-danger">Yo`q</span>'
        newsEl.top = newsEl.top == 1 ?'<span class="badge badge-primary">Ha</span>':'<span class="badge badge-danger">Yo`q</span>'
        newsEl.hot = newsEl.hot == 1 ?'<span class="badge badge-primary">Ha</span>':'<span class="badge badge-danger">Yo`q</span>'
        newsEl.topweek = newsEl.topweek == 1 ?'<span class="badge badge-primary">Ha</span>':'<span class="badge badge-danger">Yo`q</span>'
        newsEl.slider = newsEl.slider == 1 ?'<span class="badge badge-primary">Ha</span>':'<span class="badge badge-danger">Yo`q</span>'
        return newsEl
    })          
    res.render('back/news/index',{
        title: 'Yangiliklar ro`yhati',
        news,
        isNews: true,
        layout: 'back',
        category,
        author
    })
})

router.post('/',auth,upload.single('img'),async(req,res)=>{  
    let {title,category,slider,author,text,description,createdAt,view,hashList,popular,bigpopular,hot,top,topweek,status} = req.body    
    let img = 'no-image'
    status = status || 0
    popular = popular || 0
    bigpopular = bigpopular || 0
    top = top || 0
    hot = hot || 0
    slider = slider || 0
    topweek = topweek || 0
    if(req.file){                               
        img = req.file.path
    }
    let newNews = await new News({title,category,author,slider,text,description,createdAt,view,hashList,popular,bigpopular,hot,top,topweek,status,img})
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

router.get('/view/:id',auth,async(req,res)=>{
    let _id = req.params.id
    let newsEl = await News
    .findOne({_id})
    .populate('category')
    .populate('author')
    .lean()
    newsEl.createdAt = newsEl.createdAt.toLocaleString()
    newsEl.status = newsEl.status == 1 ?'<span class="badge badge-primary">Faol</span>':'<span class="badge badge-danger">Nofaol</span>'
    newsEl.popular = newsEl.popular == 1 ?'<span class="badge badge-primary">Ha</span>':'<span class="badge badge-danger">Yo`q</span>'
    newsEl.bigpopular = newsEl.bigpopular == 1 ?'<span class="badge badge-primary">Ha</span>':'<span class="badge badge-danger">Yo`q</span>'
    newsEl.top = newsEl.top == 1 ?'<span class="badge badge-primary">Ha</span>':'<span class="badge badge-danger">Yo`q</span>'
    newsEl.hot = newsEl.hot == 1 ?'<span class="badge badge-primary">Ha</span>':'<span class="badge badge-danger">Yo`q</span>'
    newsEl.topweek = newsEl.topweek == 1 ?'<span class="badge badge-primary">Ha</span>':'<span class="badge badge-danger">Yo`q</span>'
    newsEl.slider = newsEl.slider == 1 ?'<span class="badge badge-primary">Ha</span>':'<span class="badge badge-danger">Yo`q</span>'

    newsEl.comments = newsEl.comments.map((comment,index) =>{
        comment.index = index + 1
        comment.createdAt = comment.createdAt.toLocaleString()
        comment.status = comment.status == 1 ?'<span class="badge badge-primary">Faol</span>':'<span class="badge badge-danger">Nofaol</span>'
        return comment
    }) 

    res.render('back/news/view',{
        news: newsEl,
        layout: 'back',
        title: `${newsEl.title} maqola batafsil sahifasi`,
        isNews: true
    })   
})

router.post('/newcomment/:id', async(req,res)=>{
    let {name,email,text,phone} = req.body
    let _id = req.params.id
    let news = await News.findOne({_id})
    news.comments.push({name,email,text,phone})
    await news.save()
    req.flash('success','Izohingiz saqlandi, tez orada izoh ko`rib chiqiladi!')
    res.redirect(`/news/show/${_id}#comments`)
})

router.get('/deletecomment/:id/:index',auth,async(req,res)=>{
    let _id = req.params.id
    let index = req.params.index
    let news = await News.findOne({_id})
    news.comments.splice(index,1)
    await News.findByIdAndUpdate(_id,news)
    res.redirect(`/news/view/`+_id+'#comments')
})

router.get('/changecomment/:id/:index',auth,async(req,res)=>{
    let _id = req.params.id
    let index = req.params.index
    let news = await News.findOne({_id})
    news.comments[index].status = news.comments[index].status == 1 ? 0 : 1
    await News.findByIdAndUpdate(_id,news)
    res.redirect('/news/view/'+_id+'#comments')
})

router.get('/show/:id', async(req,res)=>{
    let _id = req.params.id
    let news = await News
    .findOne({_id})
    .populate('category')
    .populate('author') 
    .lean()       
    news.view += 1
    await News.findByIdAndUpdate(_id,news)         
    let newDate = new Date(news.createdAt)
    news.createdAt = `${newDate.getDate()}-${newDate.getUTCMonth()}-${newDate.getFullYear()}`

    let others = await News
    .find({category: news.category._id})
    .where({status:1})
    .where({_id: {$ne:_id}})
    .limit(2)
    .sort({_id:-1})
    .lean()

    others = others.map(other => {
        let newDate = new Date(other.createdAt)
        other.createdAt = `${newDate.getDate()}-${newDate.getUTCMonth()}-${newDate.getFullYear()}`
        return other
    })

    let categories = await Category.find({status:1}).lean()

    let popular = await News.find({status:1, popular:1})
    .where({_id: {$ne:_id}})
    .limit(3)
    .sort({_id:-1})
    .lean()

    popular = popular.map(other => {
        let newDate = new Date(other.createdAt)
        other.createdAt = `${newDate.getDate()}-${newDate.getUTCMonth()}`
        return other
    })

    res.render('front/news/show',{
        title: `${news.title} | Tez24`,
        news,
        others,
        categories,
        popular,
        success: req.flash('success')
    })
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

router.get('/change/:type/:id/:view',auth,async(req,res)=>{
    let _id = req.params.id
    let type = req.params.type
    let redir = req.params.view
    let news = await News.findOne({_id})
    news[type] = news[type] == 0 ? 1 : 0
    await news.save()

    if(redir == 'view'){
        res.redirect('/news/view/'+_id)
    }
    else {
        res.redirect('/news') 
    }
})

module.exports = router