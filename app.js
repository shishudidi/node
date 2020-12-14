var createError = require('http-errors');
var express = require('express');
var path = require('path');
var multer = require('multer');
var cookieSession = require('cookie-session');
var logger = require('morgan');
let cors = require('cors');




var app = express();

// 设置ejs模板引擎的目录
app.set('views', path.join(__dirname, 'views'));//到views目录找ejs模板
app.set('view engine', 'ejs');//设定使用的express后端熏染引擎是ejs

app.use(logger('dev'));//安装命令行日志

//body-parser被继承到express内部了  配置body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//multer的配置
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if(req.url.includes('reg')){
      cb(null, path.join(__dirname,'public','upload','user'))//写死了 ****
    }else if(req.url.includes('banner')){
      cb(null, path.join(__dirname,'public','upload','banner'))
    }else{
      cb(null, path.join(__dirname,'public','upload','product'))
    }
  }
})
let upload = multer({storage});
app.use(upload.any());//运行任何文件的上传

app.use(cookieSession({
  name:'2011',
  keys:['aa','bb','cc'],
  maxAge:1000*60*60*24
}))

app.use(cors({
  //允许所有前端域名
  "origin": ["http://127.0.0.1:8054"],  
  "credentials":true,//允许携带凭证
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE", //被允许的提交方式
  "allowedHeaders":['Content-Type','Authorization']//被允许的post方式的请求头
}));

//资源托管
app.use(express.static(path.join(__dirname, 'public','template')));
app.use('/admin',express.static(path.join(__dirname, 'public','admin')));
app.use(express.static(path.join(__dirname,'public')));

//响应
//客户端
app.use('/api/login',require('./routes/api/login'))
app.use('/api/reg',require('./routes/api/reg'))

app.all('/api/*',require('./routes/api/params'))
app.use('/api/user',require('./routes/api/user'))

// app.use('/api/home',require('./routes/api/home'))
app.use('/api/list',require('./routes/api/list'))


//短信验证接口
app.use('/message/send-code',require('./routes/message/send-code'))



//管理端
app.use('/admin', require('./routes/admin/index'));
app.use('/admin/users', require('./routes/admin/users'));
app.use('/admin/banner', require('./routes/admin/banner-json'));


//代理端

app.use('/proxy/home', require('./routes/proxy/home'));

//推送端


// 处理错误
app.use(function(req, res, next) {
  next(createError(404));
});

// 处理错误信息，在响应体上的参数
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // 渲染错误页面
  res.status(err.status || 500);

  if(req.url.includes('/api')){
    res.send({
      err:1,msg:'不存在的接口'
    })
  }else if(req.url.includes('/admin')){
    res.render('error');//后端渲染了错误页面
  }else{
    res.sendFile(path.join(__dirname,'public','template','404.html'))
  }

  
});

module.exports = app;
