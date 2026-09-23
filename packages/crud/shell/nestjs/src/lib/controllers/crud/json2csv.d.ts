// Local declaration for json2csv 6.x, which ships no types and has no @types
// package installed here. Only the surface CrudController uses is described.
declare module 'json2csv' {
  interface ParserOptions {
    fields?: string[];
  }

  class Parser {
    constructor(opts?: ParserOptions);
    parse(data: unknown): string;
  }

  export { Parser, ParserOptions };
}
