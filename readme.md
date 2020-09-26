# JsBundle
A binary file for DenoJS.

Bundle files without a hassle, and import them easily.

### API
Creating your own bundles:
```ts
import { bundle } from 'https://deno.land/x/jsbundle/mod.ts';

const myBundle: Uint8Array = await bundle(Deno.cwd());
await Deno.writeFile(Deno.cwd() + '/bundle.jsbundle', myBundle);
```
Loading your own bundles:
```ts
import { loadBundle } from 'https://deno.land/x/jsbundle/mod.ts';

const myBundle: Uint8Array = await Deno.readFile(Deno.cwd() + '/bundle.bundlejs');
const imports = await loadBundle('namespace', myBundle);
imports.get('namespace') // mod.ts file (if archived)
```

### Installation
**Latest Stable** `deno install -A --unstable -n jsbundle https://deno.land/x/jsbundle/cli.ts`

**Latest Dev** `deno install -A --unstable -n jsbundle https://raw.githubusercontent.com/RaptorsMC/jsbundle/master/cli.ts`

### CLI
Learn more about the CLI [here](/docs/cli.md)

#### To Do
- [x] Add support for runtime unbundling and imports
- [x] Export modules in runtime with api
- [ ] ZIP?