let jwt = require('jsonwebtoken');

module.exports = {

  //生成签名|令牌
  sigin: ({ username, _id }) => {
    if (!username || !_id) return;
    return jwt.sign({ username, _id }, '2011', { expiresIn: 60 * 60 * 24 });//令牌时间秒计算
  },

  //校验签名
  ////业务 -> 结果 -> jeject|resolve调用返回
  verify: token => new Promise((reslove, reject) => {
    jwt.verify(token, '2011', (err, decode) => !err ? reslove(decode) : reject(err.message))
    /* jwt.verify(token, '2011', (err, decode) => {
      if (!err) {
        reslove(decode)
      } else {
        reject(err.message);//校验失败的信息返回 {username,_id,message,expiresIn}
      }
    }) */
  })

}