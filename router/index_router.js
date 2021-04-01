//使用express快速创建web服务器
const express = require('express')
const router = express.Router()
const conn = require('../utils/sql')
const jwt = require('jsonwebtoken')
router.use(express.urlencoded())

//接口12：文章类型
router.get('/category', (req, res) => {
    const { id, name } = req.query
    //sql语句
    const sqlStrSelect = `select * from categories where id="${id}"`
    conn.query(sqlStrSelect, (err, result) => {
        //说明查询出错
        if (err) {
            console.log(err);
            res.json({ status: 1, message: '服务器错误' })
            return
        }
        res.json({
            status: 0, message: '获取文章类型成功',
            data: result
        })
    })
})

//接口13：热点图
router.get('/hotpic', (req, res) => {
    const { id, imgurl } = req.query
    //sql语句
    const sqlStrSelect = `select * from articles where id="${id}"`
    conn.query(sqlStrSelect, (err, result) => {
        //说明查询出错
        if (err) {
            console.log(err);
            res.json({ status: 1, message: '服务器错误' })
            return
        }
        res.json({
            status: 0, message: '获取热点图成功',
            data: result
        })
    })
})

//接口14：文章热门排行
router.get('/rank', (req, res) => {
    const { id, title } = req.query
    //sql语句
    const sqlStrSelect = `select * from articles where id="${id}"`
    conn.query(sqlStrSelect, (err, result) => {
        //说明查询出错
        if (err) {
            console.log(err);
            res.json({ status: 1, message: '服务器错误' })
            return
        }
        res.json({
            status: 0, message: '获取文章热门排行成功',
            data: result
        })
    })
})

//接口15：最新资讯
router.get('/latest', (req, res) => {
    const { id, title } = req.query
    //sql语句
    const sqlStrSelect = `select * from articles where id="${id}"`
    conn.query(sqlStrSelect, (err, result) => {
        //说明查询出错
        if (err) {
            console.log(err);
            res.json({ status: 1, message: '服务器错误' })
            return
        }
        res.json({
            status: 0, message: '获取文章热门排行成功',
            data: result
        })
    })
})

//接口16： 最新评论
router.get('/latest_comment', (req, res) => {
    console.log('最新评论参数', req.query);
    const { author, date, intro } = req.query
    const sqlStr = `select * from comments where author="${author}" and date="${date}"`
    conn.query(sqlStr, (err, result) => {
        if (err) {
            res.json({
                "status": 0,
                "message": "最新评论获取失败！"
            })
            return
        }
        console.log(result);
        res.json({
            status: 0,
            message: "最新评论获取成功！",
            data: result[author, date, intro],
        })
    })
})
//接口17： 文章详细内容
router.get('/artitle', (req, res) => {
    console.log('文章详细内容参数', req.query);
    const { id } = req.query
    const sqlStr = `select * from articles where id="${id}"`
    conn.query(sqlStr, (err, result) => {
        if (err) {
            res.json({
                "status": 0,
                "message": "文章详细内容获取失败！"
            })
            return
        }
        console.log(result);
        res.json({
            status: 0,
            message: "文章详细内容获取成功！",
            data: result,
        })
    })
})


module.exports = router