import * as colors from "https://deno.land/std/fmt/colors.ts";
import { DEV, VERSION } from "../mod.ts";
export const BUNDLEJS = colors.bold(
  colors.rgb24("JS", 0x039dfc) + colors.rgb24("Bundle", 0x03cafc),
);
function aqua(str: string): string {
  return colors.rgb24(str, 0x03e3fc);
}
export function LogHelp() {
  let helpMsg = [
    BUNDLEJS +
    colors.rgb24(" - Javascript and Typescript bundler for Deno.", 0xc3c6c7),

    colors.white("\nUSAGE:"),
    `   jsbundle ${aqua("<command>")} [options] [flags]`,
    
    colors.white("\nCOMMANDS:"),
    `   ${aqua("pack")}     bundles the source files of a directory`,
    `   ${aqua("bundle")}   Alias for pack`,
    `   ${aqua("unpack")}   extracts a bundled file`,
    `   ${aqua("extract")}  Alias for unpack`,
    `   ${aqua("unbundle")} Alias for unpack`,
    `   ${aqua("help")}     shows help for JSBundle`,
    `   ${aqua("version")}  Get the current ${BUNDLEJS} version`,
    `   ${aqua("upgrade")}  Updates JSBundle`,

    colors.white("\nOPTIONS:"),
    `   ${aqua("[dir]")}    The file or directory to bundle or unbundle`,
    `   ${aqua("[loc]")}    The location to bundle or location to extract a bundle to`,
    `   ${aqua("[ignore]")} A list of directory names to ignore while bundling`,

    colors.white("\nFLAGS:"),
    `   ${aqua("--force")}  Forcefully applies a command`,
    `   ${aqua("--dev")}    Upgrade to dev branch instead of stable`,

  ];

  for (let msg of helpMsg) {
    console.log(msg);
  }
}

export function LogError(str: string): void {
  console.log(colors.bold(colors.rgb24(`Error! `, 0xff4a4a)) + str);
}

export function LogSuccess(str: string): void {
  console.log(colors.bold(colors.rgb24(`Success! `, 0x4aff89)) + str);
}

export function LogWarn(str: string): void {
  console.log(colors.bold(colors.rgb24(`Warning! `, 0xffd84a)) + str);
}

export function LogInfo(str: string): void {
  console.log(colors.rgb24(str, 0xc7c7c7));
}

export function LogVersion() {
  console.log(
    "You are running " + BUNDLEJS + " v" + colors.bold(
      VERSION + ((DEV) ? "-DEV" : ""),
    ),
  );
}
