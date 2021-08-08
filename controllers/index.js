/*
Để express có thể hiển được, ta sẽ tạo mới một đối tượng route. Express cung cấp cho ta phương thức 
Router() để tạo mới một router.


Với việc sử dụng .env, ta bắn 1 mũi tên mà trúng 2 đích:

    Giấu các thông tin bí mật (username, password) trong file .env, không được commit thông qua git thông thường.
    Tận dụng để chuyển qua lại giữa các môi trường ứng với mục đích sử dụng khác nhau.

*/

const express=require('express')
const router=express.Router()

router.get('/',(req,res)=>
{
    res.send('hello world second time');
})

module.exports=router;

/* khác biệt giữa app.use và app.get: 
app.use không quan tâm là get post delete hay gì mà chỉ thực hiện middleware với tất cả 
route có đường dẫn chỉ định

app.get thực hiện get protocol với 1 route tham số của nó
*/






