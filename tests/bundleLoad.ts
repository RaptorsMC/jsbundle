// run ./bundle.ts first
import { loadBundle } from '../mod.ts';
const dire = Deno.cwd() + "/jsbundle.jsbundle";
const test = await Deno.readFile(dire);
const unpackedFile = await loadBundle('test', test);
const testMod = unpackedFile.main;
console.log('The bundle version for this is: ' + testMod?.VERSION);