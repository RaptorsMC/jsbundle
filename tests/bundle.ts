import { compile, decompile, bundleSync } from "../mod.ts";
import { resolve } from "https://deno.land/std@0.71.0/path/mod.ts";
const project = bundleSync(Deno.cwd(), [".git"]);
Deno.writeFile(Deno.cwd() + "/everything.bundlejs", project);
