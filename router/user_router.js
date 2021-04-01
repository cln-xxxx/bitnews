//使用express快速创建web服务器
const express = require('express')
const router = express.Router()
const conn = require('../utils/sql')
const jwt = require('jsonwebtoken')
router.use(express.urlencoded())

//文件上传到指定文件和修改为指定的名字
const multer = require('multer')
// const upload = multer({dest: 'uploads'})
// 精细化去设置，如何去保存文件
const storage = multer.diskStorage({
    // 保存在哪里
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    // 保存时，文件名叫什么
    filename: function (req, file, cb) {
        // console.log('file', file)
        // 目标： 新名字是时间戳+后缀名
        const filenameArr = file.originalname.split('.');
        // filenameArr.length-1是找到最后一个元素的下标
        const fileName = Date.now() + "." + filenameArr[filenameArr.length - 1]
        cb(null, fileName) //
    }
})
const upload = multer({ storage })

//接口3：获取用户的基本信息
router.get('/userinfo', (req, res) => {
    //1,获取用户传递的参数
    //如何获取get方式在请求行中传递的数据  req.query
    console.log('用户传递的参数', req.query);
    const { username } = req.query
    //2,拼接sql语句
    const sqlStr = `select * from users where username="${username}"`
    // if (username){
    // sqlStr += ` and name="${username}"`
    // }
    console.log('sql语句:', sqlStr);
    //3,去数据库做查询
    conn.query(sqlStr, (err, result) => {
        //4,根据不同查询结果，返回不同的数据
        console.log(err);
        if (err) {
            res.json({ status: 1, message: '查询错误' })
            return
        }
        res.json({ status: 0, message: '请求成功', data: result[0] })
    })
    // res.send('ok')
})

//接口4：更新用户数据
router.post('/userinfo', (req, res) => {
    const { id, nickname, email, userPic } = req.body
    //拼接sql语句
    const sqlStrSelect = `update users set nickname="${nickname}",email="${email}",userPic="${userPic}"  where id="${id}"`
    console.log(sqlStrSelect);
    conn.query(sqlStrSelect, (err, result) => {
        //说明查询结果
        if (err) {
            console.log(err);
            res.json({ status: 1, message: '服务器错误' })
            return
        }
        //成功
        res.json({ status: 0, message: '修改用户信息成功' })
    })
})

//接口5：上传用户头像
router.post('/uploadPic', upload.single('file_data'), (req, res) => {
    //如果文件上传成功
    console.log('本次上传的文件是', req.file);
    res.json({
        "code": 0,
        "msg": "上传成功",
        "src": "http://127.0.0.1:1128/uploadPic/" + req.file.filename
    })
})

//接口6：重置密码
router.post('/updatepwd',(req,res)=>{
    const { oldPwd, newPwd,id} =req.body
    //sql语句
    const sqlStr=`select password from users where id="${id}"`
    //执行
    conn.query(sqlStr,(err,result)=>{
        //说明查询错误
        if(err){
            res.json({ status: 1, message: "服务器错误"})
            return
        }
        console.log(result);
        //如果从数据库获取过来的原密码与输入的旧密码不一致，说明错误
        if (result.password != oldPwd){
            console.log(err);
            res.json({status:1,message:'旧密码错误'})
            return
        }
        const sqlStr=`update users set password ="${newPwd}" where id="${id}"`
        conn.query(sqlStr,(err,result)=>{
            //说明查询出错
            if(err){
                console.log(err);
                res.json({status:1,message:'服务器错误'})
                return
            }
            res.json({
                status:0,message:'密码修改成功'
            })
        })
    })

})
module.exports = router