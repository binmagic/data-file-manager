import { DataFileManager } from "../src/DataFileManager";
import { execSync } from "child_process";
import { writeFileSync } from "fs";

execSync("mkdir ./test-root");

DataFileManager.setRoot("./test-root");
// 解析JSON
DataFileManager.addFile("a.json", (event: string, data: string) => {
    if (event === "unlink") console.log("a.json removed");
    else console.log("a.json content changed");
});
// 不解析文件内容
DataFileManager.addFile("b", (event: string, data: string) => {
    console.log("b changed");
});
// 自定义解析器
DataFileManager.addFile(
    "c",
    (event: string, data: string) => {
        console.log("customize parser, content", data);
    },
    (data: string) => {
        return data.split(" ");
    },
);

writeFileSync("./test-root/a.json", JSON.stringify({ a: 1, b: 2 }));
writeFileSync("./test-root/c", "k v");

setTimeout(() => {
    writeFileSync("./test-root/a.json", JSON.stringify({ a: 1, b: 2, c: 3 }));
}, 1000);

setTimeout(() => {
    execSync("rm -rf ./test-root");
}, 2000);
