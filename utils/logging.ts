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

    colors.white("USAGE:"),
    `   jsbundle ${aqua("<command>")} [options] [outfile]`,

    colors.white("OPTIONS:"),
    `   ${aqua("[file]")}   The file to extract/unbundle`,
    `   ${aqua("[dir]")}    The directory to pack/bundle`,

    colors.white("OUTFILE:"),
    `   ${aqua("filename")} The name of the newly bundled file`,
    `   ${aqua("dirname")}  The name of the directory to extract to`,

    colors.white("COMMANDS:"),
    `   ${aqua("pack")}     bundles the source files of a directory`,
    `   ${aqua("unpack")}   extracts a bundled file`,
    `   ${aqua("help")}     shows help for JSBundle`,
    `   ${aqua("version")}  Get the current ${BUNDLEJS} version`,
    `   ${aqua("upgrade")}  Updates JSBundle`,
    `   ${aqua("bundle")}   Alias for pack`,
    `   ${aqua("extract")}  Alias for unpack`,
    `   ${aqua("unbundle")} Alias for unpack`,
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
