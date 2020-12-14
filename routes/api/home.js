let express = require('express');
let router = express.Router();

let findList = require('../../utils/mgdb').findList;

router.get('/',(req,res,next)=>{
  //整理查询参数
  let {_page,_limit,_sort,q} = req.query
  console.log(1,_limit)
  //查询
  findList({dbName:'newsapp',collectionName:'home',_page,_limit,_sort,q}).then(
    result=>res.send(result)
  ).catch(
    err=>res.send(err)
  )
});

module.exports=router;