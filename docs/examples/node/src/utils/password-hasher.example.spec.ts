import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { User } from '@smartsoft001/auth-domain';
import { AuthService } from '@smartsoft001/auth-shell-app-services';
import { CrudService } from '@smartsoft001/crud-shell-app-services';
import { IItemRepository } from '@smartsoft001/domain-core';
import { IUser } from '@smartsoft001/users';
import { PasswordService } from '@smartsoft001/utils';

import { AppModule } from './password-hasher.example';
import {
  createDocsUserRepository,
  DOCS_CLIENT_ID,
  InMemoryUserRepository,
} from '../auth/password-grant.example';
import { InMemoryNoteRepository, Note } from '../crud/crud-service.example';

const PBKDF2_HASH = /^pbkdf2-sha256\$600000\$[a-f0-9]{32}\$[a-f0-9]{64}$/;
const admin: IUser = { username: 'anna', permissions: ['admin'] };

describe('docs-examples-node: PASSWORD_HASHER set to Pbkdf2PasswordHasher', () => {
  let moduleRef: TestingModule;
  let users: InMemoryUserRepository;
  let notes: InMemoryNoteRepository;

  function login(password: string) {
    return moduleRef.get(AuthService).create({
      grant_type: 'password',
      username: 'anna',
      password,
      client_id: DOCS_CLIENT_ID,
    });
  }

  beforeEach(async () => {
    // A user stored before the switch, with the legacy MD5 hash.
    users = await createDocsUserRepository();
    notes = new InMemoryNoteRepository();

    moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(getRepositoryToken(User))
      .useValue(users)
      .overrideProvider(IItemRepository)
      .useValue(notes)
      .compile();
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  it('should still log in a user whose hash is legacy MD5', async () => {
    const token = await login('secret');

    expect(token.username).toBe('anna');
  });

  it('should upgrade the legacy hash on that successful login', async () => {
    await login('secret');

    expect(users.users[0].password).toMatch(PBKDF2_HASH);
    expect(users.users[0].password).toHaveLength(118);
  });

  it('should keep the legacy hash when the password is wrong', async () => {
    const legacy = await PasswordService.hash('secret');

    await expect(login('wrong')).rejects.toThrow();

    expect(users.users[0].password).toBe(legacy);
  });

  it('should hash a password stored through CrudService the same way', async () => {
    const note = new Note();
    note.title = 'Release plan';
    note.password = 'secret';

    await moduleRef.get(CrudService).create(note, admin);

    expect(notes.items[0].password).toMatch(PBKDF2_HASH);
  });
});
