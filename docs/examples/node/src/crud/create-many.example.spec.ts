import { IUser } from '@smartsoft001/users';

import { importNotes } from './create-many.example';
import {
  createNoteService,
  InMemoryNoteRepository,
  Note,
} from './crud-service.example';

const admin: IUser = { username: 'anna', permissions: ['admin'] };

function buildNotes(): Note[] {
  const first = new Note();
  first.title = 'Release plan';

  const second = new Note();
  second.title = 'Retro notes';

  return [first, second];
}

describe('docs-examples-node: CrudService.createMany', () => {
  let repository: InMemoryNoteRepository;

  beforeEach(() => {
    repository = new InMemoryNoteRepository();
  });

  it('should clear the collection before inserting in the replace mode', async () => {
    const service = createNoteService(repository);
    const clear = jest.spyOn(repository, 'clear');
    const createMany = jest.spyOn(repository, 'createMany');

    await importNotes(service, buildNotes(), admin, 'replace');

    expect(clear.mock.invocationCallOrder[0]).toBeLessThan(
      createMany.mock.invocationCallOrder[0],
    );
  });

  it('should keep the existing items in the default mode', async () => {
    const service = createNoteService(repository);
    const clear = jest.spyOn(repository, 'clear');

    await importNotes(service, buildNotes(), admin, 'default');

    expect(clear).not.toHaveBeenCalled();
  });

  it('should return every note with a generated id', async () => {
    const service = createNoteService(repository);

    const result = await importNotes(service, buildNotes(), admin, 'default');

    expect(result.map((note: Note) => typeof note.id)).toEqual([
      'string',
      'string',
    ]);
  });
});
