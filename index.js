const express = require('express')
const app = express()
const mongoose = require('mongoose')
const expHbs = require('express-handlebars')
const session = require('express-session') // avtorizatsiya registratsiya qilish uchun
const flash = require('connect-flash')  // avtorizatsiya registratsiya qilish uchun
const csrf = require('csurf')  // avtorizatsiya registratsiya qilish uchun


// routers
const pageRouter = require('./router/page')
const hbs = expHbs.create({
    defaultLayout: 'front',
    extname: 'hbs'
})          

app.engine('hbs', hbs.engine)
app.set('view engine','hbs')
app.set('views','temp')

app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))
app.use('/files',express.static('files'))

app.post('/',(req,res)=>{
    let {title, age} = req.body
    res.end(`
        ${title} | ${age}
    `)
})

app.use(session({
    secret:'Biror bir mahfiy kalit',  // ikki kishi orasida o'rnatilgan mahfiy kalit so'z
    saveUninitialized: false, // tizimdan log out qilganda save qilishni so'rash
    cookie: {
        maxAge: 1000 * 60 * 60 * 10, 
        secure: false
    },
    resave: true
}))
app.use(csrf())
app.use(flash())

app.use(pageRouter)


const PORT = 3003
async function dev(){
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/news',{
            useNewUrlParser:true
        }),
        app.listen(PORT,()=>{
            console.log(`Server is running on ${PORT} port`);
        })
    } catch (error) {
        console.log(error);
    }
}
dev()