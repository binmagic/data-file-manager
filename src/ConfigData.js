"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chokidar_1 = require("chokidar");
const path_1 = require("path");
const fs_1 = require("fs");
class ConfigData {
    static setRoot(root, defaultParser, ignored) {
        ConfigData.root = root;
        ConfigData.defaultParser = defaultParser;
        chokidar_1.watch(root, { ignored }).on("all", ConfigData.onAllEvent);
    }
    static addFile(path, callback, parser) {
        ConfigData.registered.set(path, { callback, parser });
    }
    static onAllEvent(event, path) {
        const relativePath = path_1.relative(ConfigData.root, path);
        const handler = ConfigData.registered.get(relativePath);
        if (!handler)
            return;
        const data = event === "unlink" ? null : ConfigData.parseFile(path, handler);
        handler.callback(event, data);
    }
    static parseFile(path, handler) {
        const fileContent = fs_1.readFileSync(path, { encoding: "utf-8" });
        if (path.endsWith(".json"))
            return JSON.parse(fileContent);
        const parser = handler.parser || ConfigData.defaultParser;
        return parser ? parser(fileContent) : fileContent;
    }
}
ConfigData.registered = new Map();
exports.ConfigData = ConfigData;
//# sourceMappingURL=ConfigData.js.map