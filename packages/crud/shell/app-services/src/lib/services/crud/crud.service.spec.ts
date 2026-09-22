import 'reflect-metadata';

import { of, Observable } from 'rxjs';

import { DomainValidationError } from '@smartsoft001/domain-core';
import { Field, Model } from '@smartsoft001/models';

import { CrudService } from './crud.service';

jest.mock('@smartsoft001/utils', () => ({
  PasswordService: { hash: jest.fn(async (v) => 'hashed-' + v) },
  GuidService: { create: jest.fn(() => 'guid') },
}));

const mockUser = { id: 'u', username: 'test', permissions: ['p'] };
const mockData = { id: 'id', password: 'pw', passwordConfirm: 'pw' };
const mockRepo = () => ({
  create: jest.fn(),
  createMany: jest.fn(),
  getById: jest.fn().mockResolvedValue({ id: 'id', password: 'pw' }),
  getByCriteria: jest
    .fn()
    .mockResolvedValue({ data: [{ id: 'id', password: 'pw' }], totalCount: 1 }),
  update: jest.fn(),
  updatePartial: jest.fn(),
  delete: jest.fn(),
  clear: jest.fn(),
  changesByCriteria: jest.fn(() => of({})),
});
const mockAttachRepo = () => ({
  upload: jest.fn(),
  getInfo: jest
    .fn()
    .mockResolvedValue({ fileName: 'f', contentType: 'c', length: 1 }),
  getStream: jest.fn().mockResolvedValue({}),
  delete: jest.fn(),
});
const mockPerm = () => ({ valid: jest.fn() });

describe('crud-app-services: CrudService', () => {
  let service: CrudService<any>;
  let repository: any;
  let attachmentRepository: any;
  let permissionService: any;

  beforeEach(() => {
    repository = mockRepo();
    attachmentRepository = mockAttachRepo();
    permissionService = mockPerm();
    service = new CrudService(
      permissionService,
      repository,
      attachmentRepository,
    );
  });

  describe('create', () => {
    it('should create and return id', async () => {
      const id = await service.create({ ...mockData }, mockUser);
      expect(typeof id).toBe('string');
    });
    it('should log and throw on error', async () => {
      permissionService.valid.mockImplementation(() => {
        throw new Error('fail');
      });
      await expect(service.create({ ...mockData }, mockUser)).rejects.toThrow(
        'fail',
      );
    });
  });

  describe('createMany', () => {
    it('should create many and return data', async () => {
      const data = await service.createMany([{ ...mockData }], mockUser, {
        mode: undefined,
      });
      expect(Array.isArray(data)).toBe(true);
    });
    it('should clear repo if mode is replace', async () => {
      await service.createMany([{ ...mockData }], mockUser, {
        mode: 'replace',
      });
      expect(repository.clear).toHaveBeenCalled();
    });
    it('should log and throw on error', async () => {
      permissionService.valid.mockImplementation(() => {
        throw new Error('fail');
      });
      await expect(
        service.createMany([{ ...mockData }], mockUser, { mode: undefined }),
      ).rejects.toThrow('fail');
    });
  });

  describe('readById', () => {
    it('should return result without password', async () => {
      const res = await service.readById('id', mockUser);
      expect(res?.password).toBeUndefined();
    });
    it('should return null when the repository has no item with that id', async () => {
      repository.getById.mockResolvedValue(null);
      await expect(service.readById('missing', mockUser)).resolves.toBeNull();
    });
    it('should log and throw on error', async () => {
      repository.getById.mockImplementation(() => {
        throw new Error('fail');
      });
      await expect(service.readById('id', mockUser)).rejects.toThrow('fail');
    });
  });

  describe('read', () => {
    it('should return data and totalCount', async () => {
      const res = await service.read({}, {}, mockUser);
      expect(res).toHaveProperty('data');
    });
    it('should log and throw on error', async () => {
      repository.getByCriteria.mockImplementation(() => {
        throw new Error('fail');
      });
      await expect(service.read({}, {}, mockUser)).rejects.toThrow('fail');
    });
  });

  describe('readBySpec', () => {
    it('should call read with spec', async () => {
      const spy = jest
        .spyOn(service, 'read')
        .mockResolvedValue({ data: [], totalCount: 0 });
      await service.readBySpec({ criteria: {} }, {}, mockUser);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update', async () => {
      await service.update('id', { ...mockData }, mockUser);
      expect(repository.update).toHaveBeenCalled();
    });
    it('should log and throw on error', async () => {
      repository.update.mockImplementation(() => {
        throw new Error('fail');
      });
      await expect(
        service.update('id', { ...mockData }, mockUser),
      ).rejects.toThrow('fail');
    });
  });

  describe('updatePartial', () => {
    it('should updatePartial', async () => {
      await service.updatePartial('id', { ...mockData }, mockUser);
      expect(repository.updatePartial).toHaveBeenCalled();
    });
    it('should log and throw on error', async () => {
      repository.updatePartial.mockImplementation(() => {
        throw new Error('fail');
      });
      await expect(
        service.updatePartial('id', { ...mockData }, mockUser),
      ).rejects.toThrow('fail');
    });
  });

  describe('delete', () => {
    it('should delete', async () => {
      await service.delete('id', mockUser);
      expect(repository.delete).toHaveBeenCalled();
    });
    it('should log and throw on error', async () => {
      repository.delete.mockImplementation(() => {
        throw new Error('fail');
      });
      await expect(service.delete('id', mockUser)).rejects.toThrow('fail');
    });
  });

  describe('uploadAttachment', () => {
    it('should upload and return id', async () => {
      const fakeStream = {
        pipe: jest.fn(),
        compose: jest.fn(),
        addListener: jest.fn(),
        on: jest.fn(),
        once: jest.fn(),
        emit: jest.fn(),
        removeListener: jest.fn(),
        destroy: jest.fn(),
        off: jest.fn(),
        removeAllListeners: jest.fn(),
        setMaxListeners: jest.fn(),
        getMaxListeners: jest.fn(),
        listeners: jest.fn(),
        rawListeners: jest.fn(),
        prependListener: jest.fn(),
        prependOnceListener: jest.fn(),
        eventNames: jest.fn(),
        listenerCount: jest.fn(),
      };
      const id = await service.uploadAttachment({
        id: '',
        fileName: '',
        stream: fakeStream,
        mimeType: '',
        encoding: '',
      });
      expect(typeof id).toBe('string');
    });
  });

  describe('getAttachmentInfo', () => {
    it('should get info', async () => {
      const info = await service.getAttachmentInfo('id');
      expect(info).toHaveProperty('fileName');
    });
  });

  describe('getAttachmentStream', () => {
    it('should get stream', async () => {
      const stream = await service.getAttachmentStream('id');
      expect(stream).toBeDefined();
    });
  });

  describe('deleteAttachment', () => {
    it('should delete attachment', async () => {
      await service.deleteAttachment('id');
      expect(attachmentRepository.delete).toHaveBeenCalled();
    });
  });

  describe('changes', () => {
    it('should return observable', () => {
      const obs = service.changes({});
      expect(obs instanceof Observable).toBe(true);
    });
  });
});

@Model({})
class Note {
  id!: string;
  @Field({
    required: true,
    create: { required: true },
    update: { required: true },
  })
  title?: string;
  @Field({ create: true, update: true })
  content?: string;
}

describe('crud-app-services: CrudService model validation', () => {
  let service: CrudService<any>;
  let repository: any;
  let attachmentRepository: any;
  let permissionService: any;

  beforeEach(() => {
    repository = mockRepo();
    attachmentRepository = mockAttachRepo();
    permissionService = mockPerm();
    service = new CrudService<any>(
      permissionService,
      repository,
      attachmentRepository,
      { type: Note },
    );
  });

  describe('create', () => {
    it('should reject a payload without a required field', async () => {
      const data: any = { content: 'x' };

      const promise = service.create(data, mockUser);

      await expect(promise).rejects.toThrow(DomainValidationError);
      expect(repository.create).not.toHaveBeenCalled();
    });

    it('should report the missing required field', async () => {
      const data: any = { content: 'x' };

      const promise = service.create(data, mockUser);

      await expect(promise).rejects.toThrow('Required fields: title');
    });

    it('should store a model instance without undeclared fields', async () => {
      const data: any = { title: 't', content: 'x', extra: 'y' };

      await service.create(data, mockUser);

      const item = repository.create.mock.calls[0][0];
      expect(item).toBeInstanceOf(Note);
      expect(item.title).toBe('t');
      expect(item.id).toBeDefined();
      expect('extra' in item).toBe(false);
    });
  });

  describe('createMany', () => {
    it('should reject when one element misses a required field', async () => {
      const data: any = [{ title: 'a' }, { content: 'x' }];

      const promise = service.createMany(data, mockUser, { mode: undefined });

      await expect(promise).rejects.toThrow('Required fields: title');
      expect(repository.createMany).not.toHaveBeenCalled();
    });

    it('should return model instances for valid elements', async () => {
      const data: any = [{ title: 'a' }, { title: 'b', content: 'x' }];

      const result = await service.createMany(data, mockUser, {
        mode: undefined,
      });

      expect(result.every((item: any) => item instanceof Note)).toBe(true);
    });
  });

  describe('update', () => {
    it('should reject a payload without a required field', async () => {
      const data: any = { content: 'x' };

      const promise = service.update('id', data, mockUser);

      await expect(promise).rejects.toThrow('Required fields: title');
    });

    it('should store a model instance with the given id', async () => {
      const data: any = { title: 't', content: 'x' };

      await service.update('id', data, mockUser);

      const item = repository.update.mock.calls[0][0];
      expect(item).toBeInstanceOf(Note);
      expect(item.id).toBe('id');
    });
  });

  describe('updatePartial', () => {
    it('should reject an empty value for a required field', async () => {
      const data: any = { title: '' };

      const promise = service.updatePartial('id', data, mockUser);

      await expect(promise).rejects.toThrow('Required fields: title');
    });

    it('should keep only the keys carried by the payload', async () => {
      const data: any = { content: 'x' };

      await service.updatePartial('id', data, mockUser);

      const item = repository.updatePartial.mock.calls[0][0];
      expect(Object.keys(item).sort()).toEqual(['content', 'id']);
    });
  });

  describe('without a configured type', () => {
    it('should store the payload without validation', async () => {
      const serviceWithoutType = new CrudService<any>(
        permissionService,
        repository,
        attachmentRepository,
      );

      await serviceWithoutType.create({ content: 'x' } as any, mockUser);

      expect(repository.create).toHaveBeenCalled();
    });
  });
});
