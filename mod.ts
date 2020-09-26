export { compile } from "./src/compile.ts";
export { decompile } from "./src/decompile.ts";
export { bundle, bundleSync } from "./src/bundle.ts";
export { unbundle, unbundleSync } from "./src/unbundle.ts";
export const VERSION = "1.0.2";
export const NUMERIC_VERISON = 102;
export const DEV = false;
export const BUNDLE_HEADER: Uint8Array = new Uint8Array(
  [
    444,
    16,
    678,
    16,
    795,
    16,
    89,
    16,
    228,
    16,
    996,
    16,
    862,
    16,
    439,
    16,
    743,
    16,
    604,
    16,
  ],
);
export interface BundleFile {
  path: string;
  name: string;
  contents: string | Uint8Array;
  isText: boolean;
}
