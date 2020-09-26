# Cli
Command line interface for JSBundle.

#### Packing
**Aliases:**
 - bundle

**Usages:**
 - General usage: `jsbundle pack <directory> [packedFileName]`
 1. `jsbundle pack ./` - Packs the contents of the current directory and sets the name of the file to the current directories name.
 2. `jsbundle pack ./src CustomBundle` - Packs the source folder to a jsbundle file called "CustomBundle"
 3. `jsbundle pack ./ ../CustomModule` - Packs the current folder to a jsbundle file in the parent directory called "CustomModule"

#### Unpacking
**Aliases:**
 - extract
 - unbundle

**Usages:**
 - General usage: `jsbundle unpack <fileName|pathToFile> [outDirectory]`
 1. `jsbundle unpack BundledCode` - Extracts the contents of BundledCode into the current directory
 2. `jsbundle unpack BundledCode ./src` - Extracts the contents of BundledCode into the src directory
 3. `jsbundle unpack ../BundledCode ./` - Extracts the contents of BundledCode to the current directory.

#### Upgrading
**Aliases:**
 - update

**Usages:**
 1. `jsbundle upgrade --dev` - Upgrades to latest developer release
 2. `jsbundle upgrade` - Upgrades to the latest stable release
