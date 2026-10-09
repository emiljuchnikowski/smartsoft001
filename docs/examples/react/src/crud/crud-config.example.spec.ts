import {
  getModelFieldsWithOptions,
  getModelOptions,
} from '@smartsoft001/models';
import { ListMode } from '@smartsoft001/react';

import { Note, noteCrudConfig } from './crud-config.example';

describe('docs-examples-react: noteCrudConfig', () => {
  it('should name the store of the feature after the entity', () => {
    expect(noteCrudConfig.entity).toBe('notes');
  });

  it('should point the config at the decorated model class', () => {
    expect(noteCrudConfig.type).toBe(Note);
  });

  it('should expose the configured page size', () => {
    expect(noteCrudConfig.pagination?.limit).toBe(25);
  });

  it('should render the list in desktop mode', () => {
    expect(noteCrudConfig.list?.mode).toBe(ListMode.desktop);
  });

  it('should carry the model title key on the decorated class', () => {
    expect(getModelOptions(Note).titleKey).toBe('title');
  });

  it('should expose both decorated fields to the list view', () => {
    const fields = getModelFieldsWithOptions(new Note());

    expect(fields.map((field) => field.key)).toEqual(['title', 'content']);
  });
});
