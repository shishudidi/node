let express = require('express');
let router = express.Router();
let fs = require('fs');
let pathLib = require('path');
let bcrypt = require('../../utils/bcrypt');
let mgdb = require('../../utils/mgdb');


router.post('/', (req, res, next) => {
  //获取用户携带数据 username,password icon nikename
  let { username, password, nikename } = req.body;
  //校验必传参数
  if (!username || !password) {
    res.send({ err: 1, msg: '用户名和密码为必传参数' })
    return;
  }
  //整理要入库数据 time nikename icon处理默认头像 生成follow,fans
  nikename = nikename || '系统自动生成昵称';//baidu->系统自动生成昵称的nodejs包->npm 下载
  let follow = 0;//关注
  let fans = 0;//粉丝
  let time = Date.now();//服务器生成注册时间
  let icon = '/upload/user/default.jpg';//默认头像

  //获取用户传递头像
  if (req.files && req.files.length > 0) {
    fs.renameSync(
      req.files[0].path,
      req.files[0].path + req.files[0].filename + pathLib.parse(req.files[0].originalname).ext
    )

    //覆盖默认头像为用户传递的头像
    icon = '/upload/user/' + req.files[0].filename + pathLib.parse(req.files[0].originalname).ext
  }


  //入库前，校验

  mgdb.open({ collectionName: 'user' }).then(
    ({ collection, client }) => {
      //校验: 存在，无法注册,不存在入库
      collection.find({ username }).toArray((err, result) => {
        if (err) {
          res.send({ err: 1, msg: 'user集合操作失败' })
          client.close()
        } else {
          if (result.length === 0) {
            //用户不存在，入库， 密码要加密
            password = bcrypt.hash(password);

            collection.insertOne({
              username, password, nikename, fans, follow, time, icon
            }, (err, result) => {
              if (!err) {
                //入库成功
                delete result.ops[0].username
                delete result.ops[0].password
                res.send({
                  err: 0, msg: '注册成功', data: result.ops[0]
                })
              } else {
                res.send({ err: 1, msg: '注册失败' })
                //预测问题： 接口响应后 文件体存入到服务器磁盘
              }
              client.close()
            })

          } else {
            
            //预测问题： 接口响应后 文件体存入到服务器磁盘
            if (icon.indexOf('default') === -1) {
              fs.unlinkSync(req.files[0].path + req.files[0].filename + pathLib.parse(req.files[0].originalname).ext)
            }

            res.send({ err: 1, msg: '用户名已存在' });
            client.close()
          }
        }
      })
    }
  ).catch(err => res.send({ err: 1, msg: '库链接失败' }))


});
module.exports = router;