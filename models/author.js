const mongoose=require('mongoose')
const Book = require('./book')
const Schema=mongoose.Schema

const AuthorSchema=new Schema({
    name: {
        type: String,
        required: true
    }
})

AuthorSchema.pre('remove', function(next) {
    Book.find({ author: this.id }, (err, books) => {
        if (err) {
          next()
        } else if (books.length > 0) {
          next(new Error('This author has books still'))
        } else {
          next()
        }
      })
})

const Author=mongoose.model('Author', AuthorSchema)
module.exports=Author