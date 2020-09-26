import { fs, path } from "../deps.ts";
import { unbundle, unbundleSync } from "./unbundle.ts";
const sep = path.sep;
const resolve = path.resolve;

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
): Promise<Map<string, any>> {
  let files = await unbundle(bundle);
  let imports: Map<string, any> = new Map();
  if (!await fs.exists(`.deno${sep}bundles${sep}${bundleName}`)) {
    await Deno.mkdir(`.deno${sep}bundles${sep}${bundleName}`, { recursive: true });
  }
  for await (let file of files) {
    file.path = file.path.replace(file.name, '');
    let ext = file.name.split('.').pop();
    if (ext !== 'js' && ext !== 'ts') continue;
    let actualPath = resolve(
      `.deno${sep}bundles${sep}${bundleName}`,
      `./${file.path}`,
      );
    let contents: Uint8Array = new TextEncoder().encode(file.contents as string);
    if (!await fs.exists(actualPath)) {
      await Deno.mkdir(actualPath, { recursive: true });
    }
    await Deno.writeFile(
      actualPath + sep + file.name,
      contents,
    );
    if (modOnly && (file.name == modOnlyName + '.ts' || file.name == modOnlyName + '.js')) {
      imports.set(`${bundleName}/${file.path}${file.name}`, resolve(actualPath, `./${file.name}#${Date.now()}`));
      imports.set(bundleName, resolve(actualPath, `./${file.name}#${Date.now()}`));
    } else if (!modOnly) {
      imports.set(`${bundleName}/${file.path}${file.name}`, resolve(actualPath, `./${file.name}#${Date.now()}`));
    }
  }

  for await (let fileMod of imports) {
    if (typeof fileMod[1] === 'string') {
        const module = await import(fileMod[1]);
        imports.set(fileMod[0], module);
    }
  }

  if (deleteAfter) {
    Deno.remove(`.deno${sep}bundles${sep}${bundleName}`, {recursive: true}).catch(e => {});
  }

  return imports;
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
): Promise<Map<string, any>> {
  let files = await unbundle(bundle);
  let imports: Map<string, any> = new Map();
  if (!await fs.exists(`.deno${sep}bundles${sep}${bundleName}`)) {
    await Deno.mkdir(`.deno${sep}bundles${sep}${bundleName}`, { recursive: true });
  }
  for await (let file of files) {
    file.path = file.path.replace(file.name, '');
    let ext = file.name.split('.').pop();
    if (ext !== 'js' && ext !== 'ts') continue;
    let actualPath = resolve(
      `.deno${sep}bundles${sep}${bundleName}`,
      `./${file.path}`,
      );
    let contents: Uint8Array = new TextEncoder().encode(file.contents as string);
    if (!await fs.exists(actualPath)) {
      await Deno.mkdir(actualPath, { recursive: true });
    }
    await Deno.writeFile(
      actualPath + sep + file.name,
      contents,
    );

    imports.set(`${bundleName}${sep}${file.path}${file.name}`, resolve(actualPath, `./${file.name}`));
  }

  return imports;
}
