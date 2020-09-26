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
    let decompiled = decompile(stream.read(stream.readShort()));
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
    let decompiled = decompile(stream.read(stream.readShort()));
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
  progress.total = stream.buffer.byteLength;
  while (!stream.feof()) {
    let decompiled = decompile(stream.read(stream.readShort()));
    files.push(decompiled);
    if (stream.buffer.byteOffset <= stream.buffer.byteLength) {
      progress.render(stream.buffer.byteOffset);
    }
  }
  return files;
}
