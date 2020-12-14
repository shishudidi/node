const { RSA_NO_PADDING } = require('constants');
let express = require('express');
let router = express.Router();
let fs = require('fs');
let pathLib = require('path');
let mgdb = require('../../utils/mgdb')

//管理端结果，返数据动作，前端渲染

//增
router.post('/',(req,res,next)=>{
  //抓取参数
  let {title,sub_title,auth,content} = req.body;
  let time = Date.now();

  let auth_icon,banner;

  req.files && req.files.forEach((file,index)=>{
    if(file.fieldname === 'auth_icon'){
      auth_icon = '/upload/user/' + file.filename + pathLib.parse(file.originalname).ext
    }
    if(file.fieldname === 'banner'){
      banner = '/upload/banner/' + file.filename + pathLib.parse(file.originalname).ext
    }

    fs.renameSync(
      file.path,
      file.path + pathLib.parse(file.originalname).ext
    )
  })

  if(!banner) banner = '/upload/banner/default.jpg';
  if(!auth_icon) auth_icon = '/upload/user/default.jpg';

  //开库，写入
  mgdb.open({collectionName:'banner'}).then(
    ({collection,client})=>{
      //插入
      let data = {title,sub_title,banner,time,detail:{auth,auth_icon,content}};
      collection.insertOne(data,(err,result)=>{
        if(!err && result.result.n > 0){
          res.send({
            err:0,
            msg:'成功',
            data:{
              _id: result.insertedId,
              ...data//解构
            }
          })

          //推送

          let io = require('../../bin/www');
          // console.log(1,io)

          // io.api('消息名',数据)
          io.emit('banner',data)//推送

        }else{
          res.send({err:1,msg:'添加失败'})  
        }
        client.close()
      })
    }
  )
})

//删
router.delete('/:_id',(req,res,next)=>{
  let _id = req.params._id;
  if(!_id){
    res.send({err:1,msg:'_id为必传参'})
    return;
  }

  mgdb.open({collectionName:'banner'}).then(
    ({collection,client,ObjectId})=>{
      collection.deleteOne({_id:ObjectId(_id)},(err,result)=>{
        if(!err && result.result.n>0){
          res.send({err:0,msg:'删除成功'})
        }else {
          res.send({err:0,msg:'删除失败'})
        }
        client.close()
      })
    }
  )

})

//改
router.patch('/:_id',(req,res,next)=>{
  let _id = req.params._id;
  if(!_id){
    res.send({err:1,msg:'_id为必传参'})
    return;
  }
  mgdb.open({collectionName:'banner'}).then(
    ({collection,client,ObjectId})=>{
      //查询到所有key 和 客户端传入的key 合并，删除更新前的文件
      collection.find({_id:ObjectId(_id)}).toArray((err,result)=>{
        if(!err && result.length>0){
          //整理要合并的数据
          let {title,sub_title,auth,content} = req.body;
          title=title||result[0].title;
          sub_title=sub_title||result[0].sub_title;
          auth=auth||result[0].detail.auth
          content=content||result[0].detail.content;

          let auth_icon,banner;

          req.files && req.files.forEach((file,index)=>{
            if(file.fieldname === 'auth_icon'){
              auth_icon = '/upload/user/' + file.filename + pathLib.parse(file.originalname).ext
              //删除以前  result[0].detail.auth_icon   -> res.unlink
            }
            if(file.fieldname === 'banner'){
              banner = '/upload/banner/' + file.filename + pathLib.parse(file.originalname).ext
              //删除以前  result[0].detail.auth_icon   -> res.unlink
            }

            fs.renameSync(
              file.path,
              file.path + pathLib.parse(file.originalname).ext
            )
          })

          auth_icon = auth_icon || result[0].detail.auth_icon;
          banner = banner || result[0].banner;

          let time = Date.now();
          
          //修改
          collection.updateOne({
            _id:ObjectId(_id)
          },{
            $set:{title,sub_title,banner,time,detail:{auth_icon,auth,content}},
          },(err,result)=>{
            if(!err && result.result.n>0){
              res.send({err:0,msg:'修改成功'})
            }else{
              res.send({err:1,msg:'修改失败'})
            }
            client.close()
          })
        }else{
          res.send({err:0,msg:'修改失败,数据不存在，傻笑重时'})
        }
      })

    })
})


//查 排
router.get('/',(req,res,next)=>{})

module.exports=router;