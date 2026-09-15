import { ItemChangedData, UserDto } from '@smartsoft001/crud-shell-dtos';

import { missingCredentials, toChangeMessage } from './user-dto.example';

describe('docs-examples-node: UserDto and the change feed', () => {
  it('should report both credentials as missing on an empty dto', () => {
    const dto = new UserDto();

    const result = missingCredentials(dto);

    expect(result).toEqual(['username', 'password']);
  });

  it('should report nothing once both credentials are filled', () => {
    const dto = new UserDto();
    dto.username = 'anna';
    dto.password = 'secret';

    const result = missingCredentials(dto);

    expect(result).toEqual([]);
  });

  it('should describe a create change', () => {
    const change: ItemChangedData = {
      id: 'note-1',
      type: 'create',
      data: { title: 'Release plan' },
    };

    const result = toChangeMessage(change);

    expect(result).toBe('note-1 created');
  });

  it('should describe an update change with the affected field counts', () => {
    const change: ItemChangedData = {
      id: 'note-1',
      type: 'update',
      data: {
        removedFields: ['dueDate'],
        updatedFields: { title: 'Release plan v2', priority: 2 },
      },
    };

    const result = toChangeMessage(change);

    expect(result).toBe('note-1 updated: 2 changed, 1 removed');
  });

  it('should describe a delete change', () => {
    const change: ItemChangedData = { id: 'note-1', type: 'delete' };

    const result = toChangeMessage(change);

    expect(result).toBe('note-1 deleted');
  });
});
