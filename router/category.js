const {Router} = require('express')
const router = Router()
const Category = require('../model/category')
const auth = require('../middleware/auth')

router.get('/',auth,async(req,res)=> {
    let categories = await Category.find().lean()
    categories.map(category => {
        category.status = category.status == 1 ?'<span class="badge badge-primary">Faol</span>':'<span class="badge badge-danger">Nofaol</span>'
        category.menu = category.menu == 1 ?'<span class="badge badge-primary">Ha</span>':'<span class="badge badge-danger">Yo`q</span>'
        category.footer = category.footer == 1 ?'<span class="badge badge-primary">Ha</span>':'<span class="badge badge-danger">Yo`q</span>'
        return category
    })
    res.render('back/category/index',{
        title: 'Bo`limlar ro`yhati',
        layout: 'back',
        categories,
        isCategory: true
    })
})

router.post('/',auth,async(req,res)=>{
    let {title,order,status,menu,footer} = req.body
    status = status || 0
    menu = menu || 0
    footer = footer || 0
    let newCategory = await new Category({title,order,status,menu,footer})
    await newCategory.save()
    req.flash('success','Bo`lim qo`shildi')
    res.redirect('/category')
})

router.get('/delete/:id',auth,async(req,res)=> {
    let _id = req.params.id
    await Category.findByIdAndRemove({_id})
    req.flash('success','Bo`lim o`chirildi')
    res.redirect('/category')
})

router.post('/save',auth,async(req,res)=>{
    let {_id,order,title} = req.body
    let category = await Category.findOne({_id})
    category.title = title
    category.order = order
    await Category.findByIdAndUpdate(_id,category)
    req.flash('success','Bo`lim qo`shildi!')
    res.redirect('/category')
})

// api 
router.get('/get/:id',async(req,res)=>{         
    let _id = req.params.id
    let category = await Category.findOne({_id})
    res.send(category)
})

router.get('/all',async(req,res)=>{
    let statusCategory = await Category.find({status:1}).lean()
    let menuCategory = await Category.find({menu:1}).lean()
    let footerCategory = await Category.find({footer:1}).lean()
    res.send({statusCategory,menuCategory,footerCategory})
})

router.get('/change/:type/:id',auth,async(req,res)=>{   
    let _id = req.params.id
    let type = req.params.type
    let category = await Category.findOne({_id})
    category[type] = category[type] == 0 ? 1 : 0
    await category.save()
    res.redirect('/category')   
    
})

module.exports = router