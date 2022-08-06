const multer = require('multer')

const storage = multer.diskStorage({ // yuklanish funksiyasi
    destination(req,file,cb){
        cb(null,'files')
    },
    filename(req,file,cb){
        cb(null,new Date().toISOString().replace(/:/g,'-')+'_'+file.originalname)
        // test.jpg
        // 1432432144_test.jpg
    }
})

// kelishi mn bo'lgan rasm kengaytmalari
const arrTypes = ['image/jpg','image/png','image/jpeg','image.svg+xml','image/webp']    

const fileFilter = (req,file,cb) => {
    if(arrTypes.includes(file.mimetype)){cb(null,true)}
    else{cb(null,false)}    
}

module.exports = multer({storage, fileFilter})