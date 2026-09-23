// Local declaration for busboy 1.x, which ships no types and has no @types
// package installed here. Only the surface CrudController uses is described:
// the factory export and the 'file' / 'finish' events.
declare module 'busboy' {
  import { IncomingHttpHeaders } from 'http';
  import { Readable, Writable } from 'stream';

  interface BusboyFileInfo {
    filename: string;
    encoding: string;
    mimeType: string;
  }

  interface Busboy extends Writable {
    on(
      event: 'file',
      listener: (name: string, stream: Readable, info: BusboyFileInfo) => void,
    ): this;
    on(event: 'finish', listener: () => void): this;
    on(event: string, listener: (...args: any[]) => void): this;
  }

  function busboy(config: { headers: IncomingHttpHeaders }): Busboy;

  export = busboy;
}
