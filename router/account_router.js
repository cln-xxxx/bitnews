//使用express快速创建web服务器
const express = require('express')
const router = express.Router()
const conn = require('../utils/sql')
const jwt = require('jsonwebtoken')
router.use(express.urlencoded())

//接口1：注册
router.post('/reguser', (req, res) => {
    //1,获取post过去的参数
    console.log('收到的参数', req.body);
    // res.send('ok')
    const { username, password } = req.body
    //检查名字是否有被占用
    //在数据库中做查询，如果有找到结果为空，说明名字可以使用
    //如果不为空，就说明名字被占用
    const sqlStrSelete = `select username from users where username="${username}"`
    //去数据库做查询
    conn.query(sqlStrSelete, (err, result) => {
        //说明查询错误
        if (err) {
            console.log(err);
            res.json({ status: 500, message: '服务器错误' })
            return
        }
        console.log(result);
        //如果结果大于0，说明名字被占用
        if (result.length > 0) {
            res.json({ status: 1, message: '注册失败，名字被占用' })
            return
        }
        //结果小于0，说明注册成功，添加到数据库
        //3,拼接sql语句，添加到数据表中
        // res.send('ok')
        const sqlStr=`insert into users (username,password) values("${username}","${password}")`
        console.log(sqlStr);
        //4，执行sql语句，操作数据库
        conn.query(sqlStr,(err,result)=>{
            console.log(result);
            if(err){
                console.log(err);
                res.json({ status: 500, message: '服务器错误' })
                return
            }
            //5,根据操作，做不同响应
            res.json({status:0,message:'注册成功'})
        })
    })

})

//接口2：登录
router.post('/login',(req,res)=>{
    //接收参数
    console.log('接收到的参数',req.body);
    const {username,password}=req.body
    //拼接sql语句
    //思路：根据用户名和密码去做查询，如果查到了，说明登录成功
    //查不到，说明失败
    const sqlStr=`select * from users where username="${username}" and password="${password}"`
    //执行sql语句
    conn.query(sqlStr,(err,result)=>{
        console.log(err);
        //根据结果返回
        if(err){
            res.json({status:500,message:'服务器错误'})
            return
        }
        console.log('查询结果',result);
        //只找到一个相同的，说明登录成功
        if(result.length>0){
            //放回token
            const token='Bearer '+jwt.sign(
                { name: username },
                'bitnews',                 //加密的密码，要与expres-jwt中的验证密码一致
                { expiresIn: 2 * 60 * 60 }      //过期时间，单位是秒
            )
            console.log(token);
            res.json({status:0,message:'登录成功',token})
        }else{
            res.json({status:1,message:'登录失败，用户名或密码错误'})
        }
    })
})

module.exports = router