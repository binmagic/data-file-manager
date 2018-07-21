"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chokidar_1 = require("chokidar");
const path_1 = require("path");
const fs_1 = require("fs");
class DataFileManager {
    static setRoot(root, defaultParser, ignored) {
        DataFileManager.root = root;
        DataFileManager.defaultParser = defaultParser;
        chokidar_1.watch(root, { ignored }).on("all", DataFileManager.onAllEvent);
    }
    static addFile(path, callback, parser) {
        DataFileManager.registered.set(path, { callback, parser });
    }
    static onAllEvent(event, path) {
        const relativePath = path_1.relative(DataFileManager.root, path);
        const handler = DataFileManager.registered.get(relativePath);
        if (!handler)
            return;
        const data = event === "unlink" ? null : DataFileManager.parseFile(path, handler);
        handler.callback(event, data);
    }
    static parseFile(path, handler) {
        const fileContent = fs_1.readFileSync(path, { encoding: "utf-8" });
        if (path.endsWith(".json"))
            return JSON.parse(fileContent);
        const parser = handler.parser || DataFileManager.defaultParser;
        return parser ? parser(fileContent) : fileContent;
    }
}
DataFileManager.registered = new Map();
exports.DataFileManager = DataFileManager;
//# sourceMappingURL=DataFileManager.js.map