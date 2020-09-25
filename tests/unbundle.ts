import { compile, decompile, unbundleSync} from '../mod.ts';
import { resolve } from "https://deno.land/std@0.71.0/path/mod.ts"

const file = Deno.readFileSync(Deno.cwd() + '/everything.bundlejs');
const decompiled = unbundleSync(file);
console.log(Deno.inspect(decompiled, { depth: Infinity, iterableLimit: Infinity}));