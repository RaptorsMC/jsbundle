import { fs, walk, walkSync, BinaryStream, Buffer } from '../deps.ts';
import { BundleFile, compile } from "../mod.ts";
export function bundleSync(dir: string, skippaths: string[] = []): Uint8Array {
  if (!fs.existsSync(dir)) {
    throw new Error('Can not bundle to a non-existant directory');
  }

  const files: BundleFile[] = [];
  const stream = new BinaryStream();

  for (let file of walkSync(dir)) {
    if (file.isDirectory || file.isFile) {
      let fixed = file.path.replace(dir + '/', '');
      let ignored = fixed.split(/\/|\\/ig);
      if (skippaths.includes(ignored[0])) continue;
    }
    if (file.isFile) {
      const ext = file.path.split('.').pop();
      let contents: Uint8Array;
      
      switch (ext) {
        case 'txt':
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
            path: file.path,
            name: file.name,
            contents: new TextDecoder().decode(contents),
            isText: true
          });
          break;
        default:
          contents = Deno.readFileSync(file.path);
          files.push({
            path: file.path,
            name: file.name,
            contents: contents,
            isText: false
          });
      }
    }

    for (let file of files) {
      let compiled = compile(file.path, file.name, file.contents);
      stream.writeShort(compiled.byteLength);
      stream.append(new Buffer(compiled));
    }
  }
  return stream.buffer;
}

export async function bundle(dir: string): Promise<Uint8Array> {
  if (!await fs.exists(dir)) {
    throw new Error('Can not bundle to a non-existant directory');
  }

  const files = [];
  const stream = new BinaryStream();

  for await (let file of walk(dir)) {
    if (file.isFile) {
      const ext = file.path.split('.').pop();
      switch (ext) {
        case 'txt':
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
          let contents = await Deno.readFile(file.path);
          files.push({
            path: file.path,
            name: file.name,
            contents: new TextDecoder().decode(contents)
          });
          break;
        default:
          break;
      }
    }

    for (let file of files) {
      let compiled = compile(file.path, file.name, file.contents);
      stream.writeShort(compiled.byteLength);
      stream.append(new Buffer(compiled));
    }
  }
  return stream.buffer;
}