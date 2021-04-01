//使用express快速创建web服务器
const express = require('express')
const router = express.Router()
const conn = require('../utils/sql')
const jwt = require('jsonwebtoken')
router.use(express.urlencoded())

//接口7：获取文章分类列表
router.get('/cates',(req,res)=>{
    //sql语句
    const sqlStrSelect =`select * from categories`
    conn.query(sqlStrSelect,(err,result)=>{
        //说明查询出错
        if(err){
            console.log(err);
            res.json({ status: 1, message:'服务器错误'})
            return
        }
        res.json({
            status:0,message:'获取文章分类列表成功',
            data:result
        })
    })
})

//接口8：新增文章分类
router.post('/addcates',(req,res)=>{
    const {name,slug}=req.body
    //sql语句
    const sql =`insert into categories (name,slug) values("${name}","${slug}") `
    conn.query(sql,(err,result)=>{
        if (err) {
            console.log(err);
            res.json({ status: 1, message: '服务器错误' })
            return
        }
        res.json({
            status: 0, message: '修改文章分类列表成功',
            data: result
        })
    })
})

//接口9：删除文章分类
router.get('/deletecate',(req,res)=>{
    const{id}=req.query
    //sql语句
    const sqlStrDel =`delete from categories where id="${id}"`
    conn.query(sqlStrDel,(err,result)=>{
        //说明查询出错
        if (err) {
            console.log(err);
            res.json({ status: 1, message: '服务器错误' })
            return
        }
        res.json({
            status: 0, message: '删除文章分类列表成功',
            data: result
        })
    })
})

//接口10：根据 Id 获取文章分类数据
router.get('/getCatesById',(req,res)=>{
    const {id}=req.query
    //sql语句
    const sqlStrId =`select * from categories where id="${id}"`
    conn.query(sqlStrId,(err,result)=>{
        //说明查询出错
        if (err) {
            console.log(err);
            res.json({ status: 1, message: '服务器错误' })
            return
        }
        res.json({
            status: 0, message: '获取文章分类列表成功',
            data: result
        })
    })
})

//接口11：根据 Id 更新文章分类数据
router.post('/updatecate',(req,res)=>{
    const {id,name,slug}=req.body
    const sqlStrcate =`update categories set name="${name}",slug="${slug}" where id="${id}"`
    conn.query(sqlStrcate,(err,result)=>{
        //说明查询出错
        if (err) {
            console.log(err);
            res.json({ status: 1, message: '服务器错误' })
            return
        }
        res.json({
            status: 0, message: '根据 Id 更新文章分类数据成功',
            data: result
        })
    })
})

module.exports = router