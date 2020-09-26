import { resolve, sep } from "https://deno.land/std@0.71.0/path/mod.ts";
import ProgressBar from "https://deno.land/x/progress@v1.1.3/mod.ts";
import { fs } from "../deps.ts";
import { DEV, NUMERIC_VERISON, VERSION } from "../mod.ts";
import { bundleCli } from "../src/bundle.ts";
import { unbundleCli } from "../src/unbundle.ts";
import {
     BUNDLEJS,
  LogError,
  LogHelp,
  LogInfo,
  LogSuccess,
  LogVersion,
  LogWarn,
} from "./logging.ts";

export async function pack(args: string[]) {
  let dir = args[1];
  let out;
  if (!dir) {
    return LogError("No directory provided");
  }
  if (!args[2]) {
    out = resolve(Deno.cwd(), dir).split(sep).pop() + ".jsbundle";
    LogWarn(
      'No file name provided for out file. Using name "' + out + '"',
    );
  } else {
    out = args[2];
    if (out.split(".").pop() !== "jsbundle") {
      out = out + ".jsbundle";
    }
  }
  let res = resolve(Deno.cwd(), dir);
  if (!fs.existsSync(res)) {
    return LogError("Can not find provided directory: " + res);
  } else {
    try {
      LogInfo(`Bundling everything in: ${res}`);
      let progress = new ProgressBar({ title: "Bundling... ", width: 25 });
      let bundled = await bundleCli(res, progress, [".git"]);
      Deno.writeFileSync(resolve(Deno.cwd(), `./${out}`), bundled);
      return LogSuccess(`Bundled everything into: ${out}`);
    } catch (e) {
      return LogError(e);
    }
  }
}

export async function unpack(args: string[]) {
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
      let progress = new ProgressBar({ title: "Extracting... ", width: 25 });
      let bundledFiles = await unbundleCli(file, progress);
      progress = new ProgressBar(
        { total: bundledFiles.length, title: "Creating Files", width: 25 },
      );
      progress.total = bundledFiles.length;
      let completed = 0;
      for await (let extractedFile of bundledFiles) {
        let actualPath = resolve(
          out,
          "./" + extractedFile.path.replace(extractedFile.name, ""),
        );
        let contents: Uint8Array;
        if (typeof extractedFile.contents === "string") {
          contents = new TextEncoder().encode(extractedFile.contents);
        } else {
          contents = extractedFile.contents;
        }

        if (!await fs.exists(actualPath)) {
          await Deno.mkdir(actualPath, { recursive: true });
        }
        await Deno.writeFile(
          resolve(actualPath, `./${extractedFile.name}`),
          contents,
        );
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
}


export async function upgrade() {
     const response = await fetch(
     "https://raw.githubusercontent.com/RaptorsMC/jsbundle/master/utils/version.json"
     ).catch(err => {
          LogError(`Couldn't get updates, check your connection to make sure you're connected.`);
     }) as Response;
     if (response.status !== 200) {
          LogError(`Couldn't get updates: ${response.statusText}`);
          return;
     }
      
     const repo = await response.json();
     
     if (repo.NUMERIC > NUMERIC_VERISON) {
          setTimeout(async () => {
               let success = await execInstall();
               if (success) {
                    LogSuccess('Upgraded ' + BUNDLEJS + ` ${VERSION} -> ${repo.VERSION}`);
               } else {
                    LogError(`Failed to upgrade.`);
               }
          }, 100);
     } else {
          LogInfo(`You are on the latest version!`);
          return;
     }
}

export default async function execInstall(): Promise<boolean> {
     let url = 'https://deno.land/x/jsbundle/cli.ts'
     if (DEV) {
          url = 'https://raw.githubusercontent.com/RaptorsMC/jsbundle/master/cli.ts';
     }
     const process = Deno.run({ cmd: ["deno", "f", "-A", "-n", "jsbundle", url], stdout: "piped" });
     const decoder = new TextDecoder("utf-8");
   
     const out = await process.output();
     console.log(decoder.decode(out));
     const response = (await process.status()).success;
   
     if (!response) {
       process.close();
       LogError('Failed to upgrade');
     }
   
     return response;
   }