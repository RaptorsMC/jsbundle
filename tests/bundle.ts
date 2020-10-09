import { bundleSync } from "../mod.ts";
// tests when bundling causes issues for unknown reason :(
const project = bundleSync(Deno.cwd(), [".git", "tests"]);
Deno.writeFile(Deno.cwd() + "/jsbundle.jsbundle", project);