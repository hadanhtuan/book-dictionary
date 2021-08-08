/*
trong nodejs, có một biến toàn cục là process.env chứa thông tin trạng thái môi trường mà ứng 
dụng đang chạy. dotenv cho phép tải các biến môi trường lưu trong tệp .env vào process.env
*/


const express=require('express')
const app=express();
require('dotenv').config();

app.set('view engine', 'ejs')

app.use(express.static('public'))

app.listen(process.env.PORT || 3000)
const indexController=require('./controllers/index')

app.use('/', indexController) // dùng indexController cho tất cả route bắt đầu bằng /

const mongoose=require('mongoose')
mongoose.connect(process.env.DATABASE_URL,{useNewUrlParser:true})
/*check coi đã connect được tới mongodb chưa
const db=mongoose.connection
db.once('open',()=>console.log('1234'))
*/












