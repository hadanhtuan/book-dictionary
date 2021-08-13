const mongoose=require('mongoose')
const Schema=mongoose.Schema

const coverImageBasePath = 'uploads/bookCovers'

const bookSchema=new Schema({
    title: {
        type: String,
        required: true
    },
    desription: {
        type: String
    },
    publishDate: {
        type: Date,
        required: true
    },
    pageQuantity: {
        type: Number,
        required: true
    },
    coverImageName: {   
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,  // type là một collection
        ref: 'Author',                         // tham chiếu tới author
        required: true
    },
    createAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

const Book=mongoose.model('Book', bookSchema)
module.exports=Book
module.exports.coverImageBasePath = coverImageBasePath



