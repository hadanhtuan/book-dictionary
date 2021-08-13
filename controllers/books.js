const express = require('express')
const router = express.Router()
const Author = require('../models/author')
const Book = require('../models/book')
const path = require('path')
const uploadPath = path.join('public', Book.coverImageBasePath) //public/uploads/bookCovers nhưng không muốn fix cứng trong đây nên hơi rườm rà
const multer = require('multer')
console.log(uploadPath)
// const upload = multer({
//     dest: uploadPath,
//     fileFilter: (req, file, callback) => {
//         if(file.mimetype=='image/png' || file.mimetype=='image/jpeg' || file.mimetype=='image/gif')
//             callback(null, true) // callback true nếu file phù hợp, ngược lại thì false
//         else
//             callback(null, false)
//     }
// })
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype))
  }
})

router.get('/', (req, res) => {
    res.render('books/index')
})

router.get('/new', async (req, res) => {
    try {
        const authors= await Author.find({})
        res.render('books/new', {
            authors: authors
        })
    }
    catch {
        res.redirect('/')
    }
})

router.post('/', upload.single('cover'), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null
    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      publishDate: new Date(req.body.publishDate),
      pageQuantity: req.body.pageQuantity,
      coverImageName: fileName,
      description: req.body.description
    })
    
    try {
      const newBook = await book.save()
      // res.redirect(`books/${newBook.id}`)
      res.redirect(`books`)
    } catch {
        console.log(1);
    }
})

module.exports=router