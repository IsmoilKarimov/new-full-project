const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth')
const Settings = require('../model/settings')

router.get('/',auth,async(req,res)=>{
    let settings = await Settings.find().lean()
    settings.map((setting,index) =>{
        setting.index = index+1
        setting.status = setting.status == 1 ?'<span class="badge badge-primary">Faol</span>':'<span class="badge badge-danger">Nofaol</span>'
        return setting
    })
    res.render('back/settings/index',{
        title: 'Sozlamalar ro`yhati',
        settings,
        isSettings: true,
        layout: 'back'
    })
}) 

router.post('/',auth,async(req,res)=>{  
    let {title,code,value} = req.body    
    let newSettings = await new Settings({title,code,value})
    await newSettings.save()
    req.flash('success','Yangi sozlama qo`shildi!')
    res.redirect('/settings')
})

router.post('/save',auth,async(req,res)=>{
    let {_id,title,code,value} =  req.body
    let setting = {_id,title,code,value}
    await Settings.findByIdAndUpdate(_id,setting)
    req.flash('success','Sozlama ma`lumotlari yangilandi!')
    res.redirect('/settings')
})

router.get('/delete/:id',auth,async(req,res)=>{
    let _id = req.params.id
    await Settings.findByIdAndRemove({_id})
    req.flash('success','Sozlama bazadan o`chirildi!')
    res.redirect('/settings')
})

router.get('/:id',async(req,res)=>{
    let _id = req.params.id
    let setting = await Settings.findOne({_id}).lean()
    res.send(setting)
})

router.get('/all',async(req,res)=>{
    let settings = {}

    let data = await Settings.find().lean()
    data.forEach(item => {
        settings[item.code] = item.value
    })
    res.send(settings)
})

router.get('/change/:id',async(req,res)=>{
    let _id = req.params.id
    let setting = await Settings.findOne({_id})
    await setting.save()
    res.redirect('/setting') 
})

module.exports = router