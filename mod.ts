export { compile } from './src/compile.ts';
export { decompile } from './src/decompile.ts';
export { bundle, bundleSync } from './src/bundle.ts';
export { unbundle, unbundleSync } from './src/unbundle.ts';

export interface BundleFile {
  path: string;
  name: string;
  contents: string|Uint8Array;
  isText: boolean;
}