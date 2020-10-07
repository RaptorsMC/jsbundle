# JsBundle
A binary file for DenoJS.

Bundle files without a hassle, and import them easily.

### Features
 - A custom CLI! Learn about it [here](/docs/cli.md).
 - An easy to use [API](/docs/api.md).
 - Load bundles as if they were in your workspace.
 - Available on most platforms.
 - Supports most modern ES modules!

### FAQ
 - **Q:** Why not just `.zip` and `unzip`? <br /> 
     There are many reasons, however the main reason is accessibility. With jsbundle, any projects using it, can load and distribute a **single file** during runtime and experience little to no difference in performance. However while using a zip archive you need to extract and put the contents somewhere, then adjust the code.
 - **Q:** Why was this made?<br /> 
     JSBundle was made for a [MC:BE]() server software ([Netrex]()) to allow a clean plugin folder with easy distrubtible plugins with no extra effort. This was inspired by `.phar`'s and their easy accessibility.
- ** 
     

### Installation
**Latest Stable** `deno install -A --unstable -n jsbundle https://deno.land/x/jsbundle/cli.ts`

**Latest Dev** `deno install -A --unstable -n jsbundle https://raw.githubusercontent.com/RaptorsMC/jsbundle/master/cli.ts`

#### To Do
- [x] Add support for runtime unbundling and imports
- [x] Export modules in runtime with api
- [ ] ZIP?