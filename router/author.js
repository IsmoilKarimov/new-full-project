const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth')
const upload = require('../middleware/file')
const Author = require('../model/author')

router.get('/',auth,async(req,res)=>{
    let authors = await Author.find().lean()
    authors.map(author =>{
        author.status = author.status == 1 ?'<span class="badge badge-primary">Faol</span>':'<span class="badge badge-danger">Nofaol</span>'
        return author
    })
    res.render('back/author/index',{
        title: 'Mualliflar ro`yhati',
        authors,
        isAuthor: true,
        layout: 'back'
    })
}) 

router.post('/',auth,upload.single('avatar'),async(req,res)=>{  
    let {name,status} = req.body    
    let avatar = 'no-image'
    status = status || 0
    if(req.file){                               
        avatar = req.file.path
    }
    let newAuthor = await new Author({name,status,avatar})
    await newAuthor.save()
    req.flash('success','Yangi muallif qo`shildi!')
    res.redirect('/author')
})

router.post('/save',auth,upload.single('avatar'),async(req,res)=>{
    let {_id,name,status} =  req.body
    status = status || 0
    let author = {_id,name,status}
    if(req.file){
        author.avatar = req.file.path
    }
    await Author.findByIdAndUpdate(_id,author)
    req.flash('success','Muallif ma`lumotlari yangilandi!')
    res.redirect('/author')
})

router.get('/delete/:id',auth,async(req,res)=>{
    let _id = req.params.id
    await Author.findByIdAndRemove({_id})
    req.flash('success','Muallif bazadan o`chirildi!')
    res.redirect('/author')
})

router.get('/:id',async(req,res)=>{
    let _id = req.params.id
    let author = await Author.findOne({_id}).lean()
    res.send(author)
})

router.get('/change/:id', async(req,res)=>{
    let _id = req.params.id
    let author = await Author.findOne({_id})
    author.status = author.status == 0 ? 1 : 0
    await author.save()
    res.redirect('/author') 
})

module.exports = router