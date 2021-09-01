const express = require('express')
const router = express.Router()
const Author = require('../models/author')
const Book = require('../models/book')
const fs = require('fs')
const path = require('path')
const uploadPath = path.join('public', Book.coverImageBasePath) //public/uploads/bookCovers nhưng không muốn fix cứng trong đây nên hơi rườm rà
const multer = require('multer')
const upload = multer({
    dest: uploadPath,     // tạo nơi lưu file
    fileFilter: (req, file, callback) => {
        if(file.mimetype=='image/png' || file.mimetype=='image/jpeg' || file.mimetype=='image/gif')
            callback(null, true) // callback true nếu file phù hợp, ngược lại thì false
        else
            callback(null, false)
    }
})


router.get('/', async (req, res) => { // <form action="/books" method="GET">
    // try {
    //     const books =  Book.find()
    //     console.log(books)
    //     res.render('books/index', {  // phải có await để khi render thì books đã được nạp xong
    //         books: books, 
    //         searchOptions: req.query
    //     })
    //     console.log(books)
    // }
    // catch {
    //     res.redirect('/')
    // }

    let query = Book.find()
  if (req.query.title != null && req.query.title != '') {
    query = query.regex('title', new RegExp(req.query.title, 'i'))
  }
  if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
    query = query.lte('publishDate', req.query.publishedBefore)
  }
  if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
    query = query.gte('publishDate', req.query.publishedAfter)
  }
  try {
    const books = await query.exec()
    res.render('books/index', {
      books: books,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
  
})

router.get('/new', async (req, res) => {
    loadNewBook(res);
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
      const newBook = await Book.create(book)
      // res.redirect(`books/${newBook.id}`)
      res.redirect(`books`)
    } catch {
        if(book.coverImageName != null)  // không mã hóa image vào public/uploads khi có lỗi
        {
            fs.unlink(path.join(uploadPath, fileName), (error) => {
                if(error)
                    console.error(error)
            })
        }
        loadNewBook(res, true)
    }
})

async function loadNewBook(res, hasError=false)
{
    try {
        const authors= await Author.find({})
        const params = {
            authors: authors
        }
        if(hasError)
            params.errorMessage = 'Error Creating Book'  // big brain time
        res.render('books/new', params)

    }
    catch {
        res.redirect('/books')
    }
}



module.exports=router