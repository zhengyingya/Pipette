import comNedb from "../database/comNedb";
const xlsx = require("node-xlsx");

let errorTable = {};
let allowableErrorTable = {};

comNedb.find({ type: "filePath" }).then(res => {
  if (res.length !== 0) {
    let list = xlsx.parse(res[0].pathName + "/规程依据/规程依据.xlsx");
    list = list[0].data;
    for (let i = 1, len = list.length; i < len; i += 3) {
      errorTable[list[i][0]] = {
        [list[i][1]]: {
          error: list[i][2],
          repeatability: list[i][3]
        },
        [list[i + 1][1]]: {
          error: list[i + 1][2],
          repeatability: list[i + 1][3]
        },
        [list[i + 2][1]]: {
          error: list[i + 2][2],
          repeatability: list[i + 2][3]
        }
      };
      allowableErrorTable[list[i][1]] = {
        error: list[i][2],
        repeatability: list[i][3]
      };
      allowableErrorTable[list[i + 1][1]] = {
        error: list[i + 1][2],
        repeatability: list[i + 1][3]
      };
      allowableErrorTable[list[i + 2][1]] = {
        error: list[i + 2][2],
        repeatability: list[i + 2][3]
      };
    }
    console.log("basis", errorTable);
  }
});

export default errorTable;
export { allowableErrorTable };
