import type { BundleFile } from "../../mod.ts";

export class UnpackedFile {
     public name: string;
     public modules: Map<string, any>;
     public files: BundleFile[];
     #main: any;

     public constructor(name: string) {
          this.name = name;
          this.modules = new Map();
          this.files = [];
          this.#main = null;
     }

     public set main(val: any) {
          if (!this.#main) {
               this.#main = val;
          }
     }

     public get main(): any {
          return this.#main;
     }
}