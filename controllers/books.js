const express = require('express')
const router = express.Router()
const Author = require('../models/author')
const Book = require('../models/book')
const path = require('path')
const imageTypes=['image/png', 'image/jpeg', 'image/gif', 'image/jpg']
// const multer = require('multer')
// const upload = multer({
//     dest: uploadPath,     // tạo nơi lưu file
//     fileFilter: (req, file, callback) => {
//         if(file.mimetype=='image/png' || file.mimetype=='image/jpeg' || file.mimetype=='image/gif')
//             callback(null, true) // callback true nếu file phù hợp, ngược lại thì false
//         else
//             callback(null, false)
//     }
// })


router.get('/', async (req, res) => { // <form action="/books" method="GET">
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

router.post('/', async (req, res) => {
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageQuantity: req.body.pageQuantity,
        description: req.body.description
    })
    saveCover(book, req.body.cover)

	try {
      const newBook = await Book.create(book)
      // res.redirect(`books/${newBook.id}`)
      res.redirect(`books`)
    } catch {
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

function saveCover(book, imgEncoded)
{
	if(imgEncoded)
	{
		const cover=JSON.parse(imgEncoded)
		if(imageTypes.includes(cover.type))
		{
			book.coverImage=new Buffer.from(cover.data, 'base64')
			book.coverImageType=cover.type
		}
	}
	return
}

module.exports=router