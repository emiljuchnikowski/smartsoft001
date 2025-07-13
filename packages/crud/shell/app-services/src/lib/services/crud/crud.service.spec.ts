import { CrudService } from './crud.service';
import { of, Observable } from 'rxjs';

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
      expect(res.password).toBeUndefined();
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
