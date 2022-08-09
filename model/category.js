const {Schema,model} = require('mongoose')
const category = new Schema({
    title: String,
    status: {
        type: Number,
        default:0
    },
    menu: {
        type: Number,
        default: 0
    },
    footer: {
        type: Number,
        default: 0
    },
    order: Number,
})
module.exports = model('Category',category)