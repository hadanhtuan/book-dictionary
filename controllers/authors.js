const express = require("express")
const router=express.Router()
const Author=require('../models/author')

//all authors route
router.get('/', async (req, res) => { //<form action="/authors" method="GET">
    let searchValue={}

    if(req.query.name !=null)
    {
        searchValue.name= new RegExp(req.query.name, 'i') //  /pattern/modifier    /someshit/i
        console.log(searchValue.name)
    }

    try {
        const authors= await Author.find(searchValue)
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
    const author=new Author({
        name: req.body.name
    })
    try {
        const newAuthor=await author.save()
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

module.exports=router






