const express = require("express")
const router=express.Router()
const Author=require('../models/author')
const Book=require('../models/book')

//all authors route
router.get('/', async (req, res) => { //<form action="/authors" method="GET">
    // let searchValue={}
    // const query=Author.

    // if(req.query.name !=null)  // khi form có method là post thì dùng req.body, method là get thì dùng req.query
    // {
    //     searchValue.name= new RegExp(req.query.name, 'i') //  /pattern/modifier    /someshit/i
    //         setTimeout(console.log("gì "),100)
    // }

    // try {
    //     const authors= await Author.find(searchValue)
    //     res.render('authors/index', {
    //         authors:authors,
    //         searchValue:req.query.name
    //     })
    // }
    // catch {
    //     res.redirect('/')
    // }
    let query=Author.find()
    if(req.query.name)
    {
        query=query.regex('name', new RegExp(req.query.name,'i'))
    }
    try {
        const authors=await query.exec()
        res.render('authors/index', {
            authors:authors,
            searchValue:req.query.name
        })
    }
    catch {
        res.redirect('/')
    }
})

//new author route
router.get('/new', (req, res) => {
    res.render('authors/new')
})


//create author route
router.post('/', async (req, res) => {
    try {
        const newAuthor=await Author.create(req.body)
        res.redirect('/authors')
    }
    catch {
        res.render('authors/new', { errorMessage:'Error Creating Author'} )
    }

    // Author.create(req.body, (error,author) => {
    //     if(error)
    //     {
    //         res.render('authors/new', { errorMessage:'Error Creating Author'} )
    //     }
    //     else
    //     {
    //         res.redirect('/authors')
    //         console.log(author)
    //     }
    // })
})

router.get('/:id', async (req, res)=> {
    try {
        const author = await Author.findById(req.params.id)
        const book= await Book.find({author:author.id}).exec()
        res.render('authors/show', {
            author: author,
            bookByAuthor: book
        })
    }
    catch(err) {
        console.log(err)
        res.redirect('/')
    }
})

router.get('/:id/edit', async (req, res)=> {
    try {
        const author = await Author.findById(req.params.id)
        res.render('authors/edit', {
            author: author
        })
    }
    catch {
        res.redirect('/')
    }
})

router.put('/:id', async (req, res)=> {
    let author
    try {  
        author = await Author.findById(req.params.id)
        if(!req.body.name)
        {
            throw "Error updating Author"
        }
        author.name=req.body.name
        await author.save()
        res.redirect(`/authors/${author.id}`)
    }
    catch(err) {
        // res.redirect(`/authors/${author.id}/edit`, {
        res.render('authors/edit', {
            author: author,
            errorMessage: err.toString()
        })
    }
})

router.delete('/:id/', async (req, res)=> {
    let author 
    try {
        author = await Author.findById(req.params.id)
        await author.remove()
        res.redirect('/authors')
    }
    catch {
        res.redirect(`/authors/${author.id}`)
    }
})

module.exports=router






