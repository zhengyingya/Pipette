const xlsx = require("node-xlsx");
import comNedb from "../database/comNedb";
let ktTable = {};

comNedb.find({ type: "filePath" }).then(res => {
  if (res.length !== 0) {
    let list = xlsx.parse(res[0].pathName + "/规程依据/K(t)值表.xlsx");
    list = list[0].data;
    for (let i = 1, len = list.length; i < len; i++) {
      ktTable[list[i][0]] = list[i][1];
    }
    console.log("list", ktTable);
  }
});

export default ktTable;
