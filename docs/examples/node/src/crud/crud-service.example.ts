// #region usage
import { CrudService } from '@smartsoft001/crud-shell-app-services';
import {
  IAttachmentRepository,
  IEntity,
  IItemRepository,
} from '@smartsoft001/domain-core';
import { Field, Model } from '@smartsoft001/models';
import { PermissionService, SharedConfig } from '@smartsoft001/nestjs';
import { IUser } from '@smartsoft001/users';

@Model({ titleKey: 'title' })
export class Note implements IEntity<string> {
  // Assigned by `CrudService.create`, which generates a GUID for every insert.
  id!: string;

  // `required` inside the `create` block applies to the create mode only.
  @Field({ required: true, create: { required: true } })
  title?: string;

  // `confirm: true` makes the generated form render a second `passwordConfirm`
  // control. That extra control is not part of the model, so `CrudService`
  // never stores it. The password itself is hashed before it reaches the
  // repository.
  @Field({ confirm: true, create: true })
  password?: string;

  // Sent by the form, declared on no `@Field`, and therefore dropped on create.
  passwordConfirm?: string;
}

/**
 * Array-backed stand-in for the repository that `MongoModule.forRoot(...)`
 * binds in a real application. It implements only the methods this example
 * exercises, so it is cast to the full `IItemRepository` contract below.
 */
export class InMemoryNoteRepository {
  readonly items: Note[] = [];

  async create(item: Note): Promise<void> {
    this.items.push(item);
  }

  async createMany(list: Note[]): Promise<void> {
    this.items.push(...list);
  }

  async clear(): Promise<void> {
    this.items.length = 0;
  }
}

/** Wires `CrudService` by hand: permissions, item storage, attachments. */
export function createNoteService(
  repository: InMemoryNoteRepository,
): CrudService<Note> {
  const config: SharedConfig = {
    permissions: {
      create: ['admin'],
      read: ['admin', 'user'],
      update: ['admin'],
      delete: ['admin'],
    },
  };

  const attachmentRepository = {} as unknown as IAttachmentRepository<Note>;

  return new CrudService<Note>(
    new PermissionService(config),
    repository as unknown as IItemRepository<Note>,
    attachmentRepository,
  );
}

/** Validates, hashes the password, stores the note and returns its new id. */
export function createNote(
  service: CrudService<Note>,
  note: Note,
  user: IUser,
): Promise<string> {
  return service.create(note, user);
}
// #endregion
