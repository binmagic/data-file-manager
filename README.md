[TOC]

# data-file-manager

**data-file-manager**用于管理数据文件，在项目数据出现变化时热更新数据。



## 文件格式

内置支持JSON格式，根据扩展名为.json的文件生效。

如果是其他不内置支持的格式，并且没有指定解析器，将直接返回文件内容。



## API

`DataFileManager`是一个静态类，只拥有静态成员。

### DataFileManager.setRoot

---

Function Signature:

```typescript
DataFileManager.setRoot(
    root: string,
    defaultParser?: (data: string) => any,
    ignored?: RegExp,
    ): void
```

| Parameter     | Type                    | Default   | Description                                        |
| ------------- | ----------------------- | --------- | -------------------------------------------------- |
| root          | `string`                |           | 数据文件的更目录                                   |
| defaultParser | `(data: string) => any` | undefined | 默认解析器，在不内置支持，并且没有指定解析器时使用 |
| ignored       | `RegExp`                | undefined | 使用正则表达式指定忽略文件                         |



### DataFileManager.addFile

---

Function Signature:

```typescript
addFile(path: string, callback: Callback, parser?: (data: string) => any): void
```

| Parameter | Type                                 | Default   | Description                    |
| --------- | ------------------------------------ | --------- | ------------------------------ |
| path      | `string`                             |           | 监视的文件路径，相对于root路径 |
| callback  | `(event: string, data: any) => void` |           | 文件变更时的回调函数           |
| parser    | ` (data: string) => any`             | undefined | 此文件的解析器                 |



## 使用方式

假设有个数据类：

```typescript
class Data {
    private a: any; // 存放数据a
    private b: any; // 存放数据b
    private c: any; // 存放数据c

    public readA(event: string, data: any) { this.a = data }; // 文件a改变会回调
    public readB(event: string, data: any) { this.b = data }; // 文件b改变会回调
    public readC(event: string, data: any) { this.c = data }; // 文件c改变会回调
}
```

### JSON

```typescript
DataFileManager.setRoot("./path/to/root");

DataFileManager.addFile("a", data.readA);
DataFileManager.addFile("b", data.readB);
DataFileManager.addFile("c", data.readC);
```



### 每个文件的格式都相同，使用默认解析器

```typescript
DataFileManager.setRoot("./path/to/root", (data: string) => { /* ... */ });

DataFileManager.addFile("a", data.readA);
DataFileManager.addFile("b", data.readB);
DataFileManager.addFile("c", data.readC);
```



### 每个文件的格式都不同

假设`Data`文件中提供了解析方式：

```typescript
public static parseA(data: string): any { /* ... */ } // 解析数据a
public static parseB(data: string): any { /* ... */ } // 解析数据b
public static parseC(data: string): any { /* ... */ } // 解析数据c
```

设置个别解析器：

```typescript
const data: Data = new Data();

DataFileManager.setRoot("./path/to/root");
DataFileManager.addFile("a", data.readA, Data.parseA);
DataFileManager.addFile("b", data.readB, Data.parseB);
DataFileManager.addFile("c", data.readC, Data.parseC);
```

