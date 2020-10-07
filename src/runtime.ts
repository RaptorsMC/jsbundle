import { fs, path } from "../deps.ts";
import type { BundleFile } from "../mod.ts";
import { unbundle, unbundleSync } from "./unbundle.ts";
import { UnpackedFile } from "./util/UnpackedFile.ts";
const sep = path.sep;
const resolve = path.resolve;

interface QueuedFile {
  path: string;
  contents: Uint8Array;
  ref: BundleFile;
  namespace: boolean;
}
/**
 * Loads a bundle into memory and returns the imports.
 * 
 *    const mod = await loadBundle('module1', myFile);
 *    const main = mod.get('module1');
 *    main; // the mod.ts/mod.js of the packed bundle.
 * @param bundleName - The name (path) of the temporary extracted bundle
 * @param bundle - The bundle archive
 * @param modOnly - Whether or not to only load the common mod.ts or mod.js entries
 * @param deleteAfter - Whether or not to delete the temporary bundle after extraction.
 */
export async function loadBundle(
  bundleName: string,
  bundle: Uint8Array,
  modOnly: boolean = true,
  modOnlyName: string = 'mod',
  deleteAfter: boolean = true,
): Promise<UnpackedFile> {
  const FILE = new UnpackedFile(bundleName);
  const files = await unbundle(bundle);
  let importQueue: QueuedFile[] = [];
  
  if (!await fs.exists(`.deno${sep}bundles${sep}${bundleName}`)) {
    await Deno.mkdir(`.deno${sep}bundles${sep}${bundleName}`, { recursive: true });
  }
  for await (let file of files) {
    file.path = file.path.replace(file.name, '');
    let ext = file.name.split('.').pop();
    if (ext !== 'js' && ext !== 'ts') {
      // not a javascript module or typescript module.
      // todo: embed this in the file itself!
      FILE.files.push(file)
      continue;
    }

    // get our actual path
    let actualPath = resolve(
      `.deno${sep}bundles${sep}${bundleName}`,
      `./${file.path}`,
    );
    let contents: Uint8Array = (file.isText) ? new TextEncoder().encode(file.contents as string) : file.contents as Uint8Array;

    if (!await fs.exists(actualPath)) {
      await Deno.mkdir(actualPath, { recursive: true });
    }

    if (modOnly && (file.name == modOnlyName + '.ts' || file.name == modOnlyName + '.js')) {
      // this is the main file!
      // to do: refactor and build into bundled file as a bool
      // we actually need to write all of our files first
      const modulePath = resolve(actualPath, `./${file.name}`);
      await Deno.writeFile(modulePath, contents);
      importQueue.push({
        path: modulePath,
        contents: contents,
        ref: file,
        namespace: true
      });
    } else {
      const modulePath = resolve(actualPath, `./${file.name}`);
      await Deno.writeFile(modulePath, contents);
      importQueue.push({
        path: modulePath,
        contents: contents,
        ref: file,
        namespace: false
      });
    }
  }

  for (let queued of importQueue) {
    try {
      const mod = await import(queued.path + "#" + Date.now());
      if (queued.namespace) {
        FILE.main = mod;
      } else {
        if (!modOnly)
          FILE.modules.set(queued.ref.path.split(/(\\|\/)/g).join('_'), mod);
      }
    } catch (e) {
      continue;
    }
  }
  if (deleteAfter) {
    Deno.remove(`.deno${sep}bundles${sep}${bundleName}`, { recursive: true }).catch(e => {});
  }

  return FILE;
}

/**
 * Similar to loadBundle() except contents are only read, saved, and mapped, not imported.
 * It is important to note that it is up to YOU the USER to remove the temporary files!
 * 
 *    const bundle = await Deno.readFile('somefile.bundlejs');
 *    const contents = extractBundleContents(bundle);
 *    console.log(`Created: ${contents.size} files from the bundle`);
 * @param bundleName - The name (path) of the temporary extracted bundle
 * @param bundle - The bundle archive
 */
export async function extractBundleContents(
  bundleName: string,
  bundle: Uint8Array
): Promise<UnpackedFile> {
  const FILE = new UnpackedFile(bundleName);
  const files = await unbundle(bundle);
  
  if (!await fs.exists(`.deno${sep}bundles${sep}${bundleName}`)) {
    await Deno.mkdir(`.deno${sep}bundles${sep}${bundleName}`, { recursive: true });
  }
  for await (let file of files) {
    file.path = file.path.replace(file.name, '');
    FILE.files.push(file);
  }
  return FILE;
}
