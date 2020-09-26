import type ProgressBar from "https://deno.land/x/progress@v1.1.3/mod.ts";
import { fs, walk, walkSync, BinaryStream, Buffer } from "../deps.ts";
import { BundleFile, BUNDLE_HEADER, compile, decompile } from "../mod.ts";
export function unbundleSync(file: Uint8Array): BundleFile[] {
  const stream = new BinaryStream(Buffer.from(file));
  const files = [];
  const HEADER = stream.read(stream.readShort());
  if (Array.from(HEADER).join(",") !== Array.from(BUNDLE_HEADER).join(",")) {
    throw "Invalid Bundle";
  }
  while (!stream.feof()) {
    let decompiled = decompile(stream.read(Number(stream.readLong())));
    files.push(decompiled);
  }
  return files;
}

export async function unbundle(file: Uint8Array): Promise<BundleFile[]> {
  const stream = new BinaryStream(Buffer.from(file));
  const files = [];
  const HEADER = stream.read(stream.readShort());
  if (Array.from(HEADER).join(",") !== Array.from(BUNDLE_HEADER).join(",")) {
    throw "Invalid Bundle";
  }
  while (!stream.feof()) {
    let decompiled = decompile(stream.read(Number(stream.readLong())));
    files.push(decompiled);
  }
  return files;
}

export async function unbundleCli(
  file: Uint8Array,
  progress: ProgressBar,
): Promise<BundleFile[]> {
  const stream = new BinaryStream(Buffer.from(file));
  const files = [];
  const HEADER = stream.read(stream.readShort());
  if (Array.from(HEADER).join(",") !== Array.from(BUNDLE_HEADER).join(",")) {
    throw "Invalid Bundle";
  }
  progress.title = 'Extracting';
  progress.total = 1;
  while (!stream.feof()) {
    let decompiled = decompile(stream.read(Number(stream.readLong())));
    files.push(decompiled);
    progress.total = files.length;
    if (stream.buffer.byteOffset <= stream.buffer.byteLength) {
      progress.render(0);
    }
  }
  return files;
}
