import { BinaryStream, Buffer } from "../deps.ts";
export function compile(
  location: string,
  filename: string,
  filecontents: string | Uint8Array,
): Uint8Array {
  const stream = new BinaryStream();
  let specialEncoding: boolean = false;
  location = btoa(location);
  filename = btoa(filename);
  // write the location
  stream.writeShort(location.length);
  stream.append(Buffer.from(location, "utf-8"));
  // Write the filename
  stream.writeShort(filename.length);
  stream.append(Buffer.from(filename, "utf-8"));
  // Write the file contents
  if (typeof filecontents === "string") {
    try {
      filecontents = btoa(filecontents);
    } catch (e) {
      // we can always try binary
      filecontents = escape(filecontents);
      specialEncoding = true;
    }
    stream.writeBool(true);
    stream.writeBool(specialEncoding);
    stream.writeUnsignedVarLong(filecontents.length);
    stream.append(Buffer.from(filecontents, "utf-8"));
  } else {
    stream.writeBool(false);
    stream.writeBool(true); // this doesnt really matter
    stream.writeUnsignedVarLong(filecontents.length);
    stream.append(Buffer.from(filecontents));
  }
  return stream.buffer;
}
