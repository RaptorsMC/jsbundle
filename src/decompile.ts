import { BinaryStream, Buffer } from "../deps.ts";
import type { BundleFile } from "../mod.ts";
export function decompile(buf: Uint8Array): BundleFile {
  const stream = new BinaryStream(Buffer.from(buf));
  const decoder = new TextDecoder();
  let location = decoder.decode(stream.read(stream.readShort()));
  let name = decoder.decode(stream.read(stream.readShort()));
  let isText = stream.readBool();
  let isSpecial = stream.readBool();
  let contents: string | Uint8Array;

  if (!isText) {
    contents = stream.read(Number(stream.readLong()));
  } else {
    contents = (!isSpecial)
      ? atob(decoder.decode(stream.read(Number(stream.readLong()))))
      : unescape(decoder.decode(stream.read(Number(stream.readLong()))));
  }

  return {
    path: atob(location),
    name: atob(name),
    contents: contents,
    isText: isText,
  };
}
