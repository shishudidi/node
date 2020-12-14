let express = require('express');
let router = express.Router()
//向短信服务器发送请求
const Core = require('@alicloud/pop-core');

/* router.get('/', (req, res, next) => {
  let tel = req.query.tel;

  var client = new Core({
    accessKeyId: '<accessKeyId>',//审核通过后才有
    accessKeySecret: '<accessSecret>',////审核通过后才有
    endpoint: 'https://dysmsapi.aliyuncs.com',
    apiVersion: '2017-05-25'
  });

  let code = Math.floor(Math.random()*99999+10000)

  var params = {
    "RegionId": "cn-hangzhou",
    "PhoneNumbers": tel,
    "SignName": "好爽哥",
    "TemplateCode": "SMS_180345610",
    "TemplateParam": `{code:${code}}`//验证码长度
  }

  var requestOption = {
    method: 'POST'
  };

  client.request('SendSms', params, requestOption).then((res) => {
    console.log('发送成功后的',JSON.stringify(res));//发送成功后的
  }, (err) => {
    console.log(err);//发送失败后的返回值

    //返回值给客户端
    res.send({
      err:0,
      msg:'发送失败'
    })
    
  })


}); */


router.get('/', (req, res, next) => {

  let tel = req.query.tel;
  console.log(1,typeof tel)

  var client = new Core({
    accessKeyId: 'LTAIZQoVVoPuBjU9',//LTAI4FrbTmqN56E9wFB2WQdv
    accessKeySecret: 'GfJuI2dLsCQh7Q56TmFxPTniXjkVnB',//XfZg7A1sRkWTcwJh5lB6VmCTWgo6ZM
    endpoint: 'https://dysmsapi.aliyuncs.com',
    apiVersion: '2017-05-25'
  });

  let code = Math.floor(Math.random()*99999+10000)

  var params = {
    "RegionId": "cn-hangzhou",
    "PhoneNumbers": tel,
    "SignName": "吴勋勋",
    "TemplateCode": "SMS_111785721",
    "TemplateParam": `{code:${code}}`//验证码长度
  }

  var requestOption = {
    method: 'POST'
  };

  client.request('SendSms', params, requestOption).then((res) => {
    console.log('发送成功后的',JSON.stringify(res));//发送成功后的
  }, (err) => {
    console.log('err',err);//发送失败后的返回值

    //返回值给客户端
    res.send({
      err:0,
      msg:'发送失败'
    })
    
  })

});



module.exports = router;