let express = require('express');
let router = express.Router();
let http=require('http')

router.get('/',(req,res,next)=>{
  //nodejs 发出 一个 接口请求


  options={
    hostname:'47.116.74.169',//不含协议
    port:9001,
    path:'/api/goods/home',
    method:'GET'
  };

  //发送http[s]请求
  // let reqHttp = http.request(配置项,回调(响应对象resHttp)){	//返回请求对象reqHttp
  let reqHttp = http.request(options,(resHttp)=>{	//返回请求对象reqHttp
    // resHttp 响应对象
    // resHttp.statusCode 状态码  200 OK
    // resHttp.headers 获取响应头信息
    // resHttp.setEncoding('utf-8') 设置编码方式
    // resHttp.on('data/end',fn)  ->send给前端
    let str='';
    resHttp.on('data',(chunk)=>str+=chunk)

    resHttp.on('end',()=>{
      res.send(JSON.parse(str))
    })

  });

  // reqHttp //请求对象
  reqHttp.on('error',(err)=>{console.log('err',err)});	//监听请求失败信息
  reqHttp.end();//请求结束

});

module.exports=router;