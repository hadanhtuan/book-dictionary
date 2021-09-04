const mongoose=require('mongoose')
const Schema=mongoose.Schema


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
    coverImage: {   
        type: Buffer,
        required: true,
    },
    coverImageType: {   
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
    if (this.coverImage != null) {
        return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
    }
})
  
const Book=mongoose.model('Book', bookSchema)
module.exports=Book


