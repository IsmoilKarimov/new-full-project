const {Schema,model} = require('mongoose')

const author = new Schema({
    name: String,
    status: {
        type:Number,
        default: 0
    },
    avatar: String
})

module.exports = model('Author',author)