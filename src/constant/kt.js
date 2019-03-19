const xlsx = require('node-xlsx')
let list = xlsx.parse("./规程依据/K(t)值表.xlsx")
list = list[0].data
let ktTable = {}
for (let i = 1, len = list.length; i < len; i ++) {
  ktTable[list[i][0]] = list[i][1]
}
console.log('list', ktTable)


export default ktTable