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
    loadBookForm(res, new Book(), 'new');
})

router.post('/', async (req, res) => {
    let book = new Book()
    saveBook(req, book)
    console.log(book)
	try {
      const newBook = await Book.create(book)
      res.redirect(`/books/${newBook.id}`)
    } catch {
        loadBookForm(res, book, 'new', true)
    }
})


router.get('/:id', async (req, res) => {
    try {
        const book= await Book.findById(req.params.id)
        const author = await Author.findById(book.author)
        res.render('books/show', {
            book: book,
            author: author
        })
    }
    catch {
        res.redirect('/books')
    }
})

router.get('/:id/edit', async (req, res) => {
    const book = await Book.findById(req.params.id)
    loadBookForm(res, book, 'edit')
})

router.put('/:id', async (req, res) => {
    let book
    try {
        book = await Book.findById(req.params.id)
        saveBook(req, book)
        await book.save()
        res.redirect(`/books/${book.id}`)
    } 
    catch {
          loadBookForm(res, book, 'edit', true)
    }

})
router.delete('/:id', async (req, res) => {
    let book
    try {
        book = await Book.findById(req.params.id)
        await book.remove()
        res.redirect('/books')
    }
    catch {
        if(book)
        {
            res.render('books/show', {
                book: book,
                errorMessage: "Error Deleting Book"
            })
        }
        res.redirect('/')// big brain time
    }
})

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

function saveBook(req, book)
{
    book.title = req.body.title,
    book.author = req.body.author,
    book.publishDate = new Date(req.body.publishDate),
    book.pageQuantity = req.body.pageQuantity,
    book.description = req.body.description

    saveCover(book, req.body.cover)
}

async function loadBookForm(res, book, formType, hasError=false)
{
    try {
        const authors= await Author.find({})
        const params = {
            authors: authors,
            book: book
        }
        if(hasError)
        {
            if(formType=='new') {
                params.errorMessage = 'Error Creating Book'  // big brain time
            }
            else {
                params.errorMessage = 'Error Editing Book'  
            }
        }
        res.render(`books/${formType}`, params)

    }
    catch {
        res.redirect('/books')
    }
}

module.exports=router