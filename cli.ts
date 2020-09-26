import { resolve, sep } from "https://deno.land/std@0.71.0/path/mod.ts";
import ProgressBar from "https://deno.land/x/progress@v1.1.3/mod.ts";
import { pack, unpack, upgrade } from "./utils/cli.ts";
import { LogHelp, LogVersion } from "./utils/logging.ts";
export { Buffer } from "https://deno.land/std@0.70.0/node/buffer.ts";
export { BinaryStream } from "https://raw.githubusercontent.com/RaptorsMC/BinaryUtils/master/mod.ts";
export { walk, walkSync } from "https://deno.land/std@0.71.0/fs/walk.ts";

async function cli() {
  const args = Deno.args;
  switch (args[0]) {
    case "bundle":
    case "pack":
      await pack(args);
      break;
    case "unbundle":
    case "unpack":
    case "extract":
      await unpack(args);
      break;
    case "version":
      LogVersion();
      break;
    case "upgrade":
    case "update":
      upgrade(args);
      break;
    case "help":
    default:
      LogHelp();
      break;
  }
}

if (import.meta.main) {
  await cli();
}
