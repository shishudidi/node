let bcrypt = require('bcrypt');
// bcrypt.hashSync(明文密码,加盐数)
// bcrypt.compareSync(客户端传过来的明文密码,加了盐的库密码)

module.exports = {
  hash: password => bcrypt.hashSync(password, 10),
  compare: (password,hash) =>  bcrypt.compareSync(password,hash)
}