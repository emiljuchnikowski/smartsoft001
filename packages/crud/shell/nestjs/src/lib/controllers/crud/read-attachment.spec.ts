import type { Request } from 'express';

import { PassThrough } from 'stream';

import { readAttachment } from './read-attachment';

describe('crud-nestjs: multipart failure handling', () => {
  it('rejects malformed content types with a client error', async () => {
    const request = Object.assign(new PassThrough(), {
      headers: { 'content-type': 'text/plain' },
    });
    await expect(
      readAttachment(request as unknown as Request),
    ).rejects.toMatchObject({ status: 400 });
  });

  it('rejects aborted requests and removes request listeners', async () => {
    const request = Object.assign(new PassThrough(), {
      headers: { 'content-type': 'multipart/form-data; boundary=test' },
    });
    const result = readAttachment(request as unknown as Request);
    const rejection = expect(result).rejects.toMatchObject({ status: 400 });
    request.write(
      '--test\r\nContent-Disposition: form-data; name="file"; filename="test.txt"\r\n\r\nx',
    );
    request.emit('aborted');
    await rejection;
    expect(request.listenerCount('aborted')).toBe(0);
    request.destroy();
  });
});
