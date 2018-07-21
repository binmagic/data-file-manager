"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataFileManager_1 = require("../src/DataFileManager");
const child_process_1 = require("child_process");
const fs_1 = require("fs");
child_process_1.execSync("mkdir ./test-root");
DataFileManager_1.DataFileManager.setRoot("./test-root");
// 解析JSON
DataFileManager_1.DataFileManager.addFile("a.json", (event, data) => {
    if (event === "unlink")
        console.log("a.json removed");
    else
        console.log("a.json content changed");
});
// 不解析文件内容
DataFileManager_1.DataFileManager.addFile("b", (event, data) => {
    console.log("b changed");
});
// 自定义解析器
DataFileManager_1.DataFileManager.addFile("c", (event, data) => {
    console.log("customize parser, content", data);
}, (data) => {
    return data.split(" ");
});
fs_1.writeFileSync("./test-root/a.json", JSON.stringify({ a: 1, b: 2 }));
fs_1.writeFileSync("./test-root/c", "k v");
setTimeout(() => {
    fs_1.writeFileSync("./test-root/a.json", JSON.stringify({ a: 1, b: 2, c: 3 }));
}, 1000);
setTimeout(() => {
    child_process_1.execSync("rm -rf ./test-root");
}, 2000);
//# sourceMappingURL=test.js.map