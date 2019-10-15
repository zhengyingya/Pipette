const HID = require("node-hid");
const device = new HID.HID(6790, 57352);
console.log(HID.devices());
device.sendFeatureReport([
  0x00,
  0x21,
  0x09,
  0x00,
  0x03,
  0x00,
  0x00,
  0x05,
  0x00
]);
device.write([0x00, 0x01, 0x01, 0x00]);

let temp = "";
let groupData = [];
device.on("data", function(data) {
  const buf1 = data.toString("hex", 0, 1);
  const buf2 = data.toString("hex", 1, 2);
  // console.log(buf1, buf2)
  if (buf1 === "f1") {
    if (buf2 === "0d") {
      temp =
        groupData[2].substr(1, 1) +
        groupData[3].substr(1, 1) +
        "." +
        groupData[4].substr(1, 1);
      // console.log(temp)
      groupData = [];
    } else if (buf2 === "0a") {
    } else {
      groupData.push(buf2);
    }
  }
});

export default {
  get: function() {
    return temp;
  }
};
