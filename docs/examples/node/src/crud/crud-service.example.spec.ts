import { DomainValidationError } from '@smartsoft001/domain-core';
import { IUser } from '@smartsoft001/users';
import { PasswordService } from '@smartsoft001/utils';

import {
  createNote,
  createNoteService,
  InMemoryNoteRepository,
  Note,
} from './crud-service.example';

const admin: IUser = { username: 'anna', permissions: ['admin'] };

function buildNote(): Note {
  const note = new Note();
  note.title = 'Release plan';
  note.password = 'secret';
  note.passwordConfirm = 'secret';

  return note;
}

describe('docs-examples-node: CrudService over an in-memory repository', () => {
  let repository: InMemoryNoteRepository;

  beforeEach(() => {
    repository = new InMemoryNoteRepository();
  });

  it('should return the generated id of the stored note', async () => {
    const service = createNoteService(repository);

    const id = await createNote(service, buildNote(), admin);

    expect(repository.items[0].id).toBe(id);
  });

  it('should hand the note to the repository exactly once', async () => {
    const service = createNoteService(repository);
    const create = jest.spyOn(repository, 'create');

    await createNote(service, buildNote(), admin);

    expect(create).toHaveBeenCalledTimes(1);
  });

  it('should store the hashed password instead of the plain text', async () => {
    const service = createNoteService(repository);

    await createNote(service, buildNote(), admin);

    expect(repository.items[0].password).toBe(
      await PasswordService.hash('secret'),
    );
  });

  it('should drop the password confirmation before storing the note', async () => {
    const service = createNoteService(repository);

    await createNote(service, buildNote(), admin);

    expect(Object.keys(repository.items[0])).not.toContain('passwordConfirm');
  });

  it('should reject a note without a title', async () => {
    const service = createNoteService(repository);
    const note = buildNote();
    note.title = '';

    await expect(createNote(service, note, admin)).rejects.toThrow(
      new DomainValidationError('Required fields: title'),
    );
  });
});
