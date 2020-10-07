# Cli
Command line interface for JSBundle.

#### Packing
**Description:**<br />Makes a jsbundle file based on the provided arguments.<br />
**Aliases:**
 - bundle

**Usages:**
 - General usage: `jsbundle pack <directory> [packedFileName]`
 1. `jsbundle pack ./` - Packs the contents of the current directory and sets the name of the file to the current directories name.
 2. `jsbundle pack ./src CustomBundle` - Packs the source folder to a jsbundle file called "CustomBundle".
 3. `jsbundle pack ./ ../CustomModule` - Packs the current folder to a jsbundle file in the parent directory called "CustomModule".

#### Unpacking
**Description:**<br />Extracts a jsbundle file to a specific location.<br />
**Aliases:**
 - extract
 - unbundle

**Usages:**
 - General usage: `jsbundle unpack <fileName|pathToFile> [outDirectory]`
 1. `jsbundle unpack BundledCode` - Extracts the contents of BundledCode into the current directory.
 2. `jsbundle unpack BundledCode ./src` - Extracts the contents of BundledCode into the src directory.
 3. `jsbundle unpack ../BundledCode ./` - Extracts the contents of BundledCode to the current directory.

#### Upgrading
**Description:**<br />Upgrades jsbundle cli.<br />
**Aliases:**
 - update

**Usages:**
 1. `jsbundle upgrade` - Upgrades to the latest stable release.
 2. `jsbundle upgrade --force` - Upgrades to the latest stable release forcefully.
 3. `jsbundle upgrade --dev` - Upgrades to the latest developer release.
 3. `jsbundle upgrade --dev --force` - Upgrades to the latest developer release forcefully.
