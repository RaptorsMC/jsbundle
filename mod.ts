export { compile } from "./src/compile.ts";
export { decompile } from "./src/decompile.ts";
export { bundle, bundleSync } from "./src/bundle.ts";
export { unbundle, unbundleSync } from "./src/unbundle.ts";
export { loadBundle, extractBundleContents } from "./src/runtime.ts";
export { UnpackedFile } from "./src/util/UnpackedFile.ts";
/**
 * The version of JSBundle running
 */
export const VERSION = "1.0.6";

/**
 * The numeric version of JSBundle running
 */
export const NUMERIC_VERISON = 106;

/**
 * Whether or not this version is a developer version
 */
export const DEV = false;

/**
 * The header of each JSBundle
 */
export const BUNDLE_HEADER: Uint8Array = new Uint8Array([ 444, 16, 678, 16, 795, 16, 89, 16, 228, 16, 996, 16, 862, 16, 439, 16, 743, 16, 604, 16]);

/**
 * A bundledfile interface, used when unbundling and bundling.
 */
export interface BundleFile {
  path: string;
  name: string;
  contents: string | Uint8Array;
  isText: boolean;
}
