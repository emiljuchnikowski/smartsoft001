import 'reflect-metadata';

import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test } from '@nestjs/testing';

import { CrudService } from '@smartsoft001/crud-shell-app-services';
import {
  AppExceptionFilter,
  JwtStrategy,
  PermissionService,
  SharedConfig,
} from '@smartsoft001/nestjs';

import { Readable } from 'stream';

import { CrudController } from './crud.controller';

describe('crud-nestjs: attachment security over HTTP', () => {
  let app: INestApplication;
  let base: string;
  const secret = 'synthetic-attachment-test-key';
  const config: SharedConfig = {
    tokenConfig: { secretOrPrivateKey: secret, expiredIn: 60 },
    type: class {},
  };
  const headers = {
    Authorization:
      'Bearer ' +
      new JwtService({ secret }).sign({ sub: 'alice', permissions: ['user'] }),
  };
  const storage = {
    upload: jest.fn(async (data: { stream: Readable }) => {
      for await (const chunk of data.stream) {
        void chunk;
      }
    }),
    getInfo: jest.fn(async () => ({
      fileName: 'test.txt',
      contentType: 'text/plain',
      length: 4,
    })),
    getStream: jest.fn(async () => Readable.from('test')),
    delete: jest.fn(async () => undefined),
  };
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt', session: false }),
      ],
      controllers: [CrudController],
      providers: [
        JwtStrategy,
        { provide: SharedConfig, useValue: config },
        {
          provide: CrudService,
          useValue: new CrudService(
            new PermissionService(config),
            {} as any,
            storage as any,
            config,
          ),
        },
      ],
    }).compile();
    app = module.createNestApplication({ logger: false });
    app.useGlobalFilters(new AppExceptionFilter());
    await app.listen(0, '127.0.0.1');
    base = await app.getUrl();
  });
  afterAll(async () => app?.close());
  beforeEach(() => {
    jest.clearAllMocks();
    config.attachmentPolicy = undefined;
  });
  function form(size = 4) {
    const body = new FormData();
    body.append('file', new Blob([new Uint8Array(size)]), 'test.txt');
    return body;
  }

  it('rejects anonymous writes before storage', async () => {
    config.attachmentPolicy = () => true;
    expect(
      (await fetch(base + '/attachments', { method: 'POST', body: form() }))
        .status,
    ).toBe(401);
    expect(
      (await fetch(base + '/attachments/id', { method: 'DELETE' })).status,
    ).toBe(401);
    expect(storage.upload).not.toHaveBeenCalled();
    expect(storage.delete).not.toHaveBeenCalled();
  });
  it('denies access without an explicit policy even for a valid JWT', async () => {
    expect((await fetch(base + '/attachments/id', { headers })).status).toBe(
      403,
    );
    expect(
      (
        await fetch(base + '/attachments', {
          method: 'POST',
          headers,
          body: form(),
        })
      ).status,
    ).toBe(403);
    expect(storage.getInfo).not.toHaveBeenCalled();
    expect(storage.upload).not.toHaveBeenCalled();
  });
  it('passes identity and resource ID to the policy and rejects another owner', async () => {
    config.attachmentPolicy = ({ id, user }) =>
      id === 'alice-file' && user?.username === 'alice';
    expect(
      (await fetch(base + '/attachments/bob-file', { headers })).status,
    ).toBe(403);
    expect(
      (
        await fetch(base + '/attachments/bob-file', {
          method: 'DELETE',
          headers,
        })
      ).status,
    ).toBe(403);
    expect(storage.delete).not.toHaveBeenCalled();
    const response = await fetch(base + '/attachments/alice-file', { headers });
    expect(response.status).toBe(200);
    expect(await response.text()).toBe('test');
  });
  it('allows a deliberately public file through the application policy', async () => {
    config.attachmentPolicy = ({ operation, id }) =>
      operation === 'read' && id === 'public';
    expect((await fetch(base + '/attachments/public')).status).toBe(200);
    expect((await fetch(base + '/attachments/private')).status).toBe(403);
  });
  it('returns stored file metadata after a successful bounded upload', async () => {
    config.attachmentPolicy = () => true;
    const response = await fetch(base + '/attachments', {
      method: 'POST',
      headers,
      body: form(),
    });
    expect(response.status).toBe(201);
    expect(await response.json()).toMatchObject({
      fileName: 'test.txt',
      length: 4,
    });
    expect(storage.upload).toHaveBeenCalledTimes(1);
  });
  it('propagates persistence failure instead of acknowledging success', async () => {
    config.attachmentPolicy = () => true;
    storage.upload.mockRejectedValueOnce(
      new Error('synthetic storage failure'),
    );
    expect(
      (
        await fetch(base + '/attachments', {
          method: 'POST',
          headers,
          body: form(),
        })
      ).status,
    ).toBe(500);
    expect(storage.upload).toHaveBeenCalledTimes(1);
  });
  it('rejects oversized uploads before storage', async () => {
    config.attachmentPolicy = () => true;
    expect(
      (
        await fetch(base + '/attachments', {
          method: 'POST',
          headers,
          body: form(10 * 1024 * 1024 + 1),
        })
      ).status,
    ).toBe(413);
    expect(storage.upload).not.toHaveBeenCalled();
  });
  it('accepts a file exactly at the advertised size limit', async () => {
    config.attachmentPolicy = () => true;
    const response = await fetch(base + '/attachments', {
      method: 'POST',
      headers,
      body: form(10 * 1024 * 1024),
    });
    expect(response.status).toBe(201);
    expect(await response.json()).toMatchObject({ length: 10 * 1024 * 1024 });
  });
  it('rejects multiple files before storage', async () => {
    config.attachmentPolicy = () => true;
    const body = form();
    body.append('second', new Blob(['x']), 'second.txt');
    expect(
      (await fetch(base + '/attachments', { method: 'POST', headers, body }))
        .status,
    ).toBe(413);
    expect(storage.upload).not.toHaveBeenCalled();
  });
  it('rejects missing files', async () => {
    config.attachmentPolicy = () => true;
    expect(
      (
        await fetch(base + '/attachments', {
          method: 'POST',
          headers,
          body: new FormData(),
        })
      ).status,
    ).toBe(400);
    expect(storage.upload).not.toHaveBeenCalled();
  });
});
