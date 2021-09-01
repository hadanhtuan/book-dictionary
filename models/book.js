const mongoose=require('mongoose')
const path = require('path')
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
        type: mongoose.Schema.Types.ObjectId,  // type là một collection (id)
        ref: 'Author',                         // tham chiếu tới author
        required: true
    },
    createAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

//virtual: thuộc tính ảo là các trường BỔ SUNG cho model, giá trị của nó được đặt với chức năng xác định và
// không tồn tại trong cơ sở dữ liệu, chỉ tồn tại một cách logic

bookSchema.virtual('coverImagePath').get(function() {  // tạo thêm thuộc tính ảo coverImagePath cho model với chức năng trả về link ảnh
    if (this.coverImageName != null) {
      return path.join('/', coverImageBasePath, this.coverImageName)
    }
})
  
const Book=mongoose.model('Book', bookSchema)
module.exports=Book
module.exports.coverImageBasePath = coverImageBasePath  // này là base path



