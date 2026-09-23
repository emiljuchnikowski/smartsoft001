// crypto-js 4.2.0 ships no declarations and @types/crypto-js is not installed;
// this covers only the API paynow.service.ts uses.
declare module 'crypto-js' {
  interface WordArray {
    words: number[];
    sigBytes: number;
  }

  export namespace enc {
    const Base64: {
      stringify(wordArray: WordArray): string;
    };
  }

  export function HmacSHA256(message: string, key: string): WordArray;
}
