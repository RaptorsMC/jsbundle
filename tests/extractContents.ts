// run ./bundle.ts first
import { extractBundleContents } from '../mod.ts';
const dire = Deno.cwd() + "/jsbundle.jsbundle";
const test = await Deno.readFile(dire);
let imports = await extractBundleContents('test', test);
console.log(imports);