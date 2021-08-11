/*
trong nodejs, có một biến toàn cục là process.env chứa thông tin trạng thái môi trường mà ứng 
dụng đang chạy. dotenv cho phép tải các biến môi trường lưu trong tệp .env vào process.env

Async/await làm cho code bất đồng bộ nhìn và chạy gần giống như code đồng bộ.

URL là địa chỉ để mở 1 trang web
Route là cách(lộ trình) để đến trang web đó vd: app.get('/hi/:param1', function(req,res){} );

req.params đối tượng chứa tham số của route (trong URL).
req.query đối tượng chứa tham số truy vấn của URL (sau dấu ? trong URL).

ví dụ cho url: http://www.google.com/hi/there?qs1=you&qs2=tube
                req.query = {
                    qs1: 'you',
                    qs2: 'tube'
                }

                req.params = {
                    param1: 'there'
                }


*/


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

app.use('/', indexController) // dùng indexController cho tất cả route bắt đầu bằng /
app.use('/authors', authorsController)

app.listen(process.env.PORT || 3000)
  
const mongoose=require('mongoose')
mongoose.connect(process.env.DATABASE_URL,{useNewUrlParser:true})
/*check coi đã connect được tới mongodb chưa
const db=mongoose.connection
db.once('open',()=>console.log('1234'))
*/












