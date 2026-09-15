import { Response } from 'express';

import { CrudService } from '@smartsoft001/crud-shell-app-services';
import { CrudController } from '@smartsoft001/crud-shell-nestjs';
import { IUser } from '@smartsoft001/users';

import { postNote } from './crud-controller.example';
import { Note } from './crud-service.example';

const admin: IUser = { username: 'anna', permissions: ['admin'] };

class FakeResponse {
  readonly headers = new Map<string, string>();
  body: unknown = null;
  readonly req = {
    protocol: 'https',
    headers: { host: 'api.example.com' },
    url: '/notes',
  };

  set = jest.fn((field: string, value: string): FakeResponse => {
    this.headers.set(field, value);
    return this;
  });

  get = jest.fn((field: string): string | undefined => this.headers.get(field));

  send = jest.fn((body: unknown): FakeResponse => {
    this.body = body;
    return this;
  });
}

describe('docs-examples-node: CrudController create route', () => {
  let create: jest.Mock;
  let controller: CrudController<Note>;
  let response: FakeResponse;

  beforeEach(() => {
    create = jest.fn().mockResolvedValue('id-1');
    controller = new CrudController<Note>({
      create,
    } as unknown as CrudService<Note>);
    response = new FakeResponse();
  });

  function buildNote(): Note {
    const note = new Note();
    note.title = 'Release plan';

    return note;
  }

  it('should point the Location header at the created note', async () => {
    const location = await postNote(
      controller,
      buildNote(),
      admin,
      response as unknown as Response,
    );

    expect(location).toBe('https://api.example.com/notes/id-1');
  });

  it('should answer with the new id', async () => {
    await postNote(
      controller,
      buildNote(),
      admin,
      response as unknown as Response,
    );

    expect(response.body).toEqual({ id: 'id-1' });
  });

  it('should forward the payload and the caller to the service', async () => {
    const note = buildNote();

    await postNote(controller, note, admin, response as unknown as Response);

    expect(create).toHaveBeenCalledWith(note, admin);
  });
});
