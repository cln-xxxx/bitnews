// 1.0 三行代码，创建express服务器并开启监听
const express = require("express")
const server = express()

// 2.0 开启cros跨域
/*  
 请使用  npm i cors --save 安装cros包
*/
const cors = require('cors')
server.use(cors())

// 3.0 设置uploads为静态资源目录
server.use('/uploads', express.static('uploads'))

// 4.0 设置jwt
/*  
 请使用  npm i express-jwt --save 安装express-jwt包
*/
const jwt = require('express-jwt');
// app.use(jwt().unless());
// jwt() 用于解析token，并将 token 中保存的数据 赋值给 req.user
// unless() 约定某个接口不需要身份认证
server.use(jwt({
    secret: 'bitnews', // 生成token时的 钥匙，必须统一
    algorithms: ['HS256'] // 必填，加密算法，无需了解
}).unless({
    path: ['/api/login', '/api/reguser', /^\/uploads\/.*/] // 除了这两个接口，其他都需要认证
}));

// 5.0 通过路由中间件来 加载不同的路由
const userRouter = require('./router/user_router.js')
const accountRouter = require('./router/account_router.js')
const cateRouter = require('./router/cate_router.js')
server.use('/api', accountRouter)
server.use('/my', userRouter)
server.use('/my/article', cateRouter)

// 6.0 错误处理中间件用来检查token合法性
server.use((err, req, res, next) => {
    console.log('有错误', err)
    if (err.name === 'UnauthorizedError') {
        // res.status(401).send('invalid token...');
        res.status(401).send({ code: 1, message: '身份认证失败！' });
    }
});

// 1.0.1 开启监听
server.listen(1128, () => {
    console.log("您的服务器已经在1128端口就绪了");
})