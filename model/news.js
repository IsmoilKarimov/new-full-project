const {Schema,model, Types} = require('mongoose')

const news = new Schema({
    title: String,
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category"
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "Author"
    },
    text: String,
    description: String,
    createdAt: {
        type: Date,
        default:Date.now()
    },
    view: {
        type: Number,
        default:0
    },
    hashList:String,
    img: String,
    popular: {
        type:Number,
        default: 0
    },
    bigpopular: {
        type:Number,
        default: 0
    },
    hot: {
        type:Number,
        default: 0
    },
    top: {
        type:Number,
        default: 0
    },
    topweek: {
        type:Number,
        default: 0
    },
    slider: {
        type:Number,
        default: 0
    },
    status: {
        type:Number,
        default: 0
    },
    comments : [
        {
            name:String,
            phone:String,
            email:String,
            text:String,
            createdAt: {
                type:Date,
                default: Date.now()
            },
            status: {
                type:Number,
                default: 0
            }
        }
    ],
    

})

module.exports = model('News',news)