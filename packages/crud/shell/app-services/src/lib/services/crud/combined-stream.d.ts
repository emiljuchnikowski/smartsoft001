// Local declaration for combined-stream 1.0.x, which ships no types and has
// no @types package. Only the surface CrudService uses is described.
declare module 'combined-stream' {
  import { Stream } from 'stream';

  interface CombinedStream extends Stream {
    append(stream: Stream | Buffer | string): void;
    pipe<T extends NodeJS.WritableStream>(dest: T, options?: object): T;
  }

  interface CombinedStreamStatic {
    create(options?: {
      maxDataSize?: number;
      pauseStreams?: boolean;
    }): CombinedStream;
    isStreamLike(stream: unknown): boolean;
  }

  const CombinedStream: CombinedStreamStatic;
  export = CombinedStream;
}
