module.exports = (req,res,next) => {    // next = oqimlarni davom ettirish
    if(!req.session.isAuted){
        return res.redirect('/user/login')
    }
    next()
}