import { resolve, sep } from "https://deno.land/std@0.71.0/path/mod.ts";
import ProgressBar from "https://deno.land/x/progress@v1.1.3/mod.ts";
import { fs } from "./deps.ts";
import { bundleCli } from "./src/bundle.ts";
import { unbundleCli } from "./src/unbundle.ts";
import {
  LogError,
  LogHelp,
  LogInfo,
  LogSuccess,
  LogVersion,
  LogWarn,
} from "./utils/logging.ts";

export { Buffer } from "https://deno.land/std@0.70.0/node/buffer.ts";
export { BinaryStream } from "https://raw.githubusercontent.com/RaptorsMC/BinaryUtils/master/mod.ts";
export { walk, walkSync } from "https://deno.land/std@0.71.0/fs/walk.ts";
export * as fs from "https://deno.land/std@0.71.0/fs/exists.ts";

async function cli() {
  const args = Deno.args;
  switch (args[0]) {
    case "bundle":
    case "pack":
      await (async () => {
        let dir = args[1];
        let out;
        if (!dir) {
          return LogError("No directory provided");
        }
        if (!args[2]) {
          out = resolve(Deno.cwd(), dir).split(sep).pop() + '.jsbundle';
          LogWarn(
            'No file name provided for out file. Using name "' + out + '"',
          );
        } else {
          out = args[2];
          if (out.split('.').pop() !== 'jsbundle') {
            out = out + '.jsbundle';
          }
        }
        let res = resolve(Deno.cwd(), dir);
        if (!fs.existsSync(res)) {
          return LogError("Can not find provided directory: " + res);
        } else {
          try {
            LogInfo(`Bundling everything in: ${res}`);
            let progress = new ProgressBar({ title: "Bundling... " });
            let bundled = await bundleCli(res, progress, ['.git']);
            Deno.writeFileSync(resolve(Deno.cwd(), `./${out}`), bundled);
            return LogSuccess(`Bundled everything into: ${out}`);
          } catch (e) {
            return LogError(e);
          }
        }
      })();
      break;
    case "unbundle":
    case "unpack":
    case "extract":
      await (async () => {
        let file: string | Uint8Array = args[1];
        let out: string;
        if (!file) {
          return LogError("No bundled file provided.");
        }
        if (!args[2]) {
          LogWarn("No directory name provided for output. Using current.");
          out = Deno.cwd();
        } else {
          out = resolve(Deno.cwd(), `${args[2]}`);
        }
        let res = resolve(Deno.cwd(), file);
        if (!fs.existsSync(res)) {
          return LogError("Can not find provided file: " + res);
        } else {
          try {
            LogInfo(`Extracting: ${res}`);
            file = await Deno.readFile(file);
            let progress = new ProgressBar({ title: "Extracting... " });
            let bundledFiles = await unbundleCli(file, progress);
            progress = new ProgressBar(
              { total: bundledFiles.length, title: "Creating Files" },
            );
            progress.total = bundledFiles.length;
            let completed = 0;
            for await (let extractedFile of bundledFiles) {
              let actualPath = resolve(out, './' + extractedFile.path.replace(extractedFile.name, ''));
              let contents: Uint8Array;
              if (typeof extractedFile.contents === 'string') {
                contents = new TextEncoder().encode(extractedFile.contents);
              } else {
                contents = extractedFile.contents;
              }

              if (!await fs.exists(actualPath)) {
                await Deno.mkdir(actualPath, { recursive: true });
              }
              await Deno.writeFile(resolve(actualPath, `./${extractedFile.name}`), contents);
              if (completed++ <= progress.total) {
                progress.render(completed);
              }
            }
            return LogSuccess(
              `Extracting everything from ${args[1]} into: ${out}`,
            );
          } catch (e) {
               console.error(e);
            return LogError(e);
          }
        }
      })();
      break;
    case "version":
      LogVersion();
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
