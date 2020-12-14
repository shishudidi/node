let express = require('express');
let router = express.Router();

let findList = require('../../utils/mgdb').findList;
let findDetail = require('../../utils/mgdb').findDetail;

router.get('/:listname',(req,res,next)=>{
  //整理查询参数
  let {_page,_limit,_sort,q} = req.query
  let {listname} = req.params;//获取动态的接口名，作为集合名使用
  //查询
  findList({collectionName:listname,_page,_limit,_sort,q}).then(
    result=>res.send(result)
  ).catch(
    err=>res.send(err)
  )
});

router.get('/:listname/:_id',(req,res,next)=>{

   //整理查询参数
   let collectionName= req.params.listname
   let _id= req.params._id

   //查询
   findDetail({collectionName,_id}).then(
     result=>res.send(result)
   ).catch(
     err=>res.send(err)
   )
   
})

module.exports=router;