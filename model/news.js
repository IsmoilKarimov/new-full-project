const {Schema,model, Types} = require('mongoose')

const news = new Schema({
    title: String,
    text: String,
    description: String,
    cratedAt: {
        type: Date,
        default:Date.now()
    },
    view: {
        type: Number,
        default:0
    },
    hashList:String,
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category"
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "Author"
    },
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
            }
        }
    ],
    img: String,

})

module.exports = model('News',news)