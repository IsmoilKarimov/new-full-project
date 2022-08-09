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

router.get('/delete/:id', async(req,res)=> {
    let _id = req.params.id
    await Category.findByIdAndRemove({_id})
    req.flash('success','Bo`lim o`chirildi')
    res.redirect('/category')
})

// router.get()

module.exports = router