module.exports = (req,res,next) => {    // next = oqimlarni davom ettirish
    if(!req.session.isAuthed){
        return res.redirect('/user/login')
    }
    next()
}