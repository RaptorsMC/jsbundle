import { bundleSync } from "../mod.ts";
const project = bundleSync(Deno.cwd(), [".git"]);
Deno.writeFile(Deno.cwd() + "/jsbundle.bundlejs", project);