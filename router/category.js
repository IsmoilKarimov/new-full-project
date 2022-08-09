const {Router} = require('express')
const router = Router()
const Category = require('../model/category')
const auth = require('../middleware/auth')

router.get('/',auth,async(req,res)=> {
    let categories = await Category.find().lean()
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

module.exports = router