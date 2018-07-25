import { watch } from "chokidar";
import { readFileSync } from "fs";
import { isAbsolute, relative, resolve } from "path";

type Callback = (event: string, data: any) => void;
interface Handler {
    callback: Callback;
    parser?: (data: string) => any;
}

export class DataFileManager {
    private static root: string;
    private static defaultParser: ((data: string) => any) | undefined;
    private static registered: Map<string, Handler> = new Map();

    public static setRoot(
        root: string,
        defaultParser?: (data: string) => any,
        ignored?: RegExp,
    ): void {
        DataFileManager.root = root;
        DataFileManager.defaultParser = defaultParser;

        watch(root, { ignored }).on("all", DataFileManager.onAllEvent);
    }

    public static addFile(path: string, callback: Callback, parser?: (data: string) => any): void {
        DataFileManager.registered.set(path, { callback, parser });
        this.onAllEvent("first", resolve(DataFileManager.root, path));
    }

    private static onAllEvent(event: string, path: string): void {
        const relativePath: string = relative(DataFileManager.root, path);
        const handler: Handler | undefined = DataFileManager.registered.get(relativePath);
        if (!handler) return;

        const data: any = event === "unlink" ? null : DataFileManager.parseFile(path, handler);
        handler.callback(data, event);
    }

    private static parseFile(path: string, handler: Handler): any {
        const fileContent: string = readFileSync(path, { encoding: "utf-8" });

        if (path.endsWith(".json")) return JSON.parse(fileContent);

        const parser: ((data: string) => any) | undefined =
            handler.parser || DataFileManager.defaultParser;
        return parser ? parser(fileContent) : fileContent;
    }
}
