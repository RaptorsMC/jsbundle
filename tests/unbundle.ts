// run ./bundle.ts first
import { unbundleSync } from "../mod.ts";
const file = Deno.readFileSync(Deno.cwd() + "/jsbundle.jsbundle");
const decompiled = unbundleSync(file);
console.log(decompiled)