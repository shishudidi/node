let express = require('express');
let router = express.Router();
let mgdb = require('../../utils/mgdb');
let bcrypt = require('../../utils/bcrypt');
let jwt = require('../../utils/jwt');

router.post('/',(req,res,next)=>{
  console.log('login',req.headers.origin)
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
  //获取客户端携带过来的数据
  let {username,password} = req.body;
  //校验携带过来的数据
  if(!username || !password){
    res.send({err:1,msg:'用户名和密码为必传参数'});
    return;
  }
  //兜库，校验， 
  //链库
  mgdb.open({collectionName:'user'}).then(
    ({collection,client})=>{
      //查询
      collection.find({username}).toArray((err,result)=>{
        if(err){
          res.send({err:1,msg:'user集合操作失败'})
        }else{
          if(result.length>0){//是否有用户
            //校验密码
            let bl = bcrypt.compare(password,result[0].password);
            if(bl){
              //生成token
              let token = jwt.sigin({username,_id:result[0]._id})

              delete result[0].username;
              delete result[0].password;

              //返回登录后的数据给客户端
              res.send({err:0,msg:'登陆成功',data:result[0],token})
            }else{
              res.send({err:1,msg:'用户名或者密码有误'})
            }
          }else{
            res.send({err:1,msg:'用户名或者密码有误'})
          }
        }
        client.close()
      })
    }
  ).catch(err=>res.send({err:1,msg:'链接失败'}))
  
});

module.exports=router;