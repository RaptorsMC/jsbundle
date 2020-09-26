import { unbundle, loadBundle } from '../mod.ts';
const dire = Deno.cwd() + "/jsbundle.jsbundle";
const test = await Deno.readFile(dire);
let imports = await loadBundle('test', test);
const testMod = imports.get('test');
console.log('The bundle version for this is: ' + testMod.VERSION);