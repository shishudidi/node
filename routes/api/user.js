let express = require('express');
let router = express.Router();
let open = require('../../utils/mgdb').open;

router.get('/',(req,res,next)=>{
  //req.token 获取 _id   兜库 返数据
  open({collectionName:'user'}).then(
    ({collection,client,ObjectId})=>{
      collection.find({
        username:req.token.username,
        _id: ObjectId(req.token._id)
      }).toArray((err,result)=>{
        if(err){
          res.send({err:1,msg:'user集合操作失败'})
        }else{
          if(result.length>0){
            delete result[0].password;
            res.send({err:1,msg:'自动登录成功',data:result[0]})
          }else{
            res.send({err:1,msg:'自动登录失败，请重新登录'})
          }
        }
        client.close()
      })
    }
  )
});
module.exports=router;