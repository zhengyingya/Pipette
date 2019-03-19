var oracledb = require('oracledb')
var config = {
  user: 'emcselect',
  password: 'emcselect',
  connectString: "10.4.130.2:1521/orcl"
}

export default {
  doRelease: function (connection) {
    connection.close(
      function (err) {
        if (err) {
          console.error(err.message)
        }
      })
  },
  execute: function (sql) {
    return new Promise(function (resovle, reject) {
      oracledb.getConnection(
        config,
        function (err, connection) {
          if (err) {
            console.error(err.message);
            return;
          }
          connection.execute(sql,
            function (err, result) {
              if (err) {
                console.error(err.message)
                this.doRelease(connection)
                return
              }
              //打印返回的表结构
              // console.log(result.metaData)
              //打印返回的行数据
              // console.log(result.rows)
              resovle(result)
            }
          )
        }
      )
    })  
  }
}