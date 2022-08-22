const{Schema,model} = require('mongoose')

const settings = new Schema({
    title: String,
    code: String,
    value: String
})
module.exports = model('Settings',settings)