const express=require('express')
const expressLayouts = require('express-ejs-layouts')

const app=express();
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false })) // đủ má quên use body parser cái fix bug ngu luôn
require('dotenv').config();

app.set('view engine', 'ejs')
app.set('layout', 'layouts/layout') // khác với sử dụng ejs trong node-blog
app.use(expressLayouts)

app.use(express.static('public'))

const indexController=require('./controllers/index')
const authorsController=require('./controllers/authors')
const booksController=require('./controllers/books')

app.use('/', indexController) // dùng indexController cho tất cả route bắt đầu bằng /
app.use('/authors', authorsController)
app.use('/books', booksController)

app.listen(process.env.PORT || 3000)
  
const mongoose=require('mongoose')
mongoose.connect(process.env.DATABASE_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})













