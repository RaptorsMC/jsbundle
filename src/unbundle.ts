import { fs, walk, walkSync, BinaryStream, Buffer } from '../deps.ts';
import { BundleFile, compile, decompile } from "../mod.ts";
export function unbundleSync(file: Uint8Array): BundleFile[] {
  const stream = new BinaryStream(Buffer.from(file));
  const files = [];
  while (!stream.feof()) {
    let decompiled = decompile(stream.read(stream.readShort()));
    files.push(decompiled);
  }
  return files;
}

export async function unbundle(dir: string): Promise<BundleFile[]> {
  return [];
}