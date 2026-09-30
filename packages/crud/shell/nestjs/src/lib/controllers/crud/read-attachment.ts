import { BadRequestException, PayloadTooLargeException } from '@nestjs/common';
import busboy from 'busboy';
import type { Request } from 'express';

/** Buffer a single bounded file so rejected multipart requests never reach storage. */
export function readAttachment(request: Request): Promise<{
  data: Buffer;
  fileName: string;
  mimeType: string;
  encoding: string;
}> {
  return new Promise((resolve, reject) => {
    let parser: ReturnType<typeof busboy>;
    try {
      parser = busboy({
        headers: request.headers,
        limits: {
          fileSize: 10 * 1024 * 1024 + 1,
          files: 1,
          fields: 0,
          parts: 2,
        },
      });
    } catch {
      reject(new BadRequestException('Invalid multipart upload'));
      return;
    }
    const chunks: Buffer[] = [];
    let info:
      { filename: string; mimeType: string; encoding: string } | undefined;
    let settled = false;
    const aborted = () => fail(new BadRequestException('Upload interrupted'));
    const cleanup = () => {
      request.off('aborted', aborted);
      request.off('error', fail);
    };
    const fail = (error: Error) => {
      if (settled) return;
      settled = true;
      cleanup();
      request.unpipe(parser);
      request.resume();
      // Busboy can emit its file event while parsing; let that callback unwind.
      queueMicrotask(() => parser.destroy());
      reject(error);
    };
    const limit = () =>
      fail(new PayloadTooLargeException('One file up to 10 MiB is allowed'));
    parser.on('file', (_field, file, metadata) => {
      info = metadata;
      file.on('error', fail);
      file.on('limit', limit);
      file.on('data', (chunk: Buffer) => {
        if (!settled) chunks.push(chunk);
      });
    });
    parser.on('filesLimit', limit);
    parser.on('fieldsLimit', limit);
    parser.on('partsLimit', limit);
    parser.on('error', () =>
      fail(new BadRequestException('Invalid multipart upload')),
    );
    parser.on('finish', () => {
      if (settled) return;
      if (!info) return fail(new BadRequestException('A file is required'));
      settled = true;
      cleanup();
      resolve({
        data: Buffer.concat(chunks),
        fileName: info.filename,
        mimeType: info.mimeType,
        encoding: info.encoding,
      });
    });
    request.once('aborted', aborted);
    request.once('error', fail);
    request.pipe(parser);
  });
}
