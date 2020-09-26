import type ProgressBar from "https://deno.land/x/progress@v1.1.3/mod.ts";
import { resolve, sep } from "https://deno.land/std@0.71.0/path/mod.ts";
import { fs, walk, walkSync, BinaryStream, Buffer } from "../deps.ts";
import { BundleFile, BUNDLE_HEADER, compile } from "../mod.ts";
export function bundleSync(dir: string, skippaths: string[] = []): Uint8Array {
  if (!fs.existsSync(dir)) {
    throw new Error("Can not bundle to a non-existant directory");
  }

  const files: BundleFile[] = [];
  const stream = new BinaryStream();
  stream.writeShort(BUNDLE_HEADER.byteLength);
  stream.append(Buffer.from(BUNDLE_HEADER));

  for (let file of walkSync(dir)) {
    let fixed = file.path.replace(dir + sep, "");
    if (file.isDirectory || file.isFile) {
      let ignored = fixed.split(/\/|\\/ig);
      if (skippaths.includes(ignored[0])) continue;
    }
    if (file.isFile) {
      const ext = file.path.split(".").pop();
      let contents: Uint8Array;

      switch (ext) {
        case "txt":
        case "js":
        case "ts":
        case "php":
        case "yml":
        case "yaml":
        case "json":
        case "jsonc":
        case "config":
        case "cfg":
        case "gitignore":
        case "md":
          contents = Deno.readFileSync(file.path);
          files.push({
            path: fixed,
            name: file.name,
            contents: new TextDecoder().decode(contents),
            isText: true,
          });
          break;
        default:
          contents = Deno.readFileSync(file.path);
          files.push({
            path: fixed,
            name: file.name,
            contents: contents,
            isText: false,
          });
      }
    }
  }
  for (let file of files) {
    let compiled = compile(file.path, file.name, file.contents);
    stream.writeLong(BigInt(compiled.byteLength));
    stream.append(new Buffer(compiled));
  }
  return stream.buffer;
}

export async function bundle(
  dir: string,
  skippaths: string[] = [],
): Promise<Uint8Array> {
  if (!await fs.exists(dir)) {
    throw new Error("Can not bundle to a non-existant directory");
  }
  const files: BundleFile[] = [];
  const stream = new BinaryStream();
  stream.writeShort(BUNDLE_HEADER.byteLength);
  stream.append(Buffer.from(BUNDLE_HEADER));

  for await (let file of walk(dir)) {
    let fixed = file.path.replace(dir + sep, "");
    if (file.isDirectory || file.isFile) {
      let ignored = fixed.split(/\/|\\/ig);
      if (skippaths.includes(ignored[0])) continue;
    }
    if (file.isFile) {
      const ext = file.path.split(".").pop();
      let contents: Uint8Array;

      switch (ext) {
        case "txt":
        case "js":
        case "ts":
        case "php":
        case "yml":
        case "yaml":
        case "json":
        case "jsonc":
        case "config":
        case "cfg":
        case "gitignore":
        case "md":
          contents = await Deno.readFile(file.path);
          files.push({
            path: fixed,
            name: file.name,
            contents: new TextDecoder().decode(contents),
            isText: true,
          });
          break;
        default:
          contents = await Deno.readFile(file.path);
          files.push({
            path: fixed,
            name: file.name,
            contents: contents,
            isText: false,
          });
      }
    }
  }
  for (let file of files) {
    let compiled = compile(file.path, file.name, file.contents);
    stream.writeLong(BigInt(compiled.byteLength));
    stream.append(new Buffer(compiled));
  }
  return stream.buffer;
}
export async function getFilesCli(
  dir: string,
  progress: ProgressBar,
  skippaths: string[] = [],
): Promise<any[]> {
  if (!await fs.exists(dir)) {
    throw new Error("Can not bundle to a non-existant directory");
  }
  const files: BundleFile[] = [];

  const cached: string = progress.title;
  progress.title = "Fetching...";
  progress.total = 0;

  for await (let file of walkSync(dir)) {
    let fixed = file.path.replace(dir + sep, "");
    if (file.isDirectory || file.isFile) {
      let ignored = fixed.split(/\/|\\/ig);
      if (skippaths.includes(ignored[0])) continue;
    }
    if (file.isFile) {
      progress.total++;
      progress.render(0);
      const ext = file.path.split(".").pop();
      let contents: Uint8Array;

      switch (ext) {
        case "txt":
        case "js":
        case "ts":
        case "php":
        case "yml":
        case "yaml":
        case "json":
        case "jsonc":
        case "config":
        case "cfg":
        case "gitignore":
        case "md":
          contents = await Deno.readFile(file.path);
          files.push({
            path: fixed,
            name: file.name,
            contents: new TextDecoder().decode(contents),
            isText: true,
          });
          break;
        default:
          contents = await Deno.readFile(file.path);
          files.push({
            path: fixed,
            name: file.name,
            contents: contents,
            isText: false,
          });
          break;
      }
    }
  }
  progress.title = cached;
  return [files, progress];
}
export async function bundleCli(
  files: Set<BundleFile>,
  progress: ProgressBar,
): Promise<Uint8Array> {
  const stream = new BinaryStream();
  stream.writeShort(BUNDLE_HEADER.byteLength);
  stream.append(Buffer.from(BUNDLE_HEADER));
  progress.total = files.size;
  let completed = 0;
  for (let file of files) {
    let compiled = compile(file.path, file.name, file.contents);
    stream.writeLong(BigInt(compiled.byteLength));
    stream.append(new Buffer(compiled));
    completed++;
    if (completed <= progress.total) {
      progress.render(completed);
    }
  }
  return stream.buffer;
}
export async function bundleCliLarge(
  files: BundleFile[],
  progress: ProgressBar,
  bundleFile: Deno.File,
): Promise<boolean> {
  const stream = new BinaryStream();
  stream.writeShort(BUNDLE_HEADER.byteLength);
  stream.append(Buffer.from(BUNDLE_HEADER));
  await bundleFile.write(stream.buffer);

  progress.total = files.length;
  let completed = 0;

  for await (let file of files) {
    let streamFile = new BinaryStream();
    let compiled = compile(file.path, file.name, file.contents);
    streamFile.writeLong(BigInt(compiled.byteLength));
    streamFile.append(new Buffer(compiled));
    bundleFile.writeSync(streamFile.buffer);
    completed++;
    if (completed <= progress.total) {
      progress.render(completed);
    }
  }

  bundleFile.close();
  return true;
}
