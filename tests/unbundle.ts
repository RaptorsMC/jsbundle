import { unbundleSync } from "../mod.ts";
const file = Deno.readFileSync(Deno.cwd() + "/jsbundle.bundlejs");
const decompiled = unbundleSync(file);
console.log(decompiled)