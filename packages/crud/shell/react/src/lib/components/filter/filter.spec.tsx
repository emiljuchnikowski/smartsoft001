import { render, screen } from '@testing-library/react';

import { FieldType, FieldTypeDef, IModelFilter } from '@smartsoft001/models';
import { SmartProvider } from '@smartsoft001/react';

import { SmartCrudFilter } from './filter';
import { CrudProvider } from '../../crud.provider';
import { CrudService } from '../../services/crud/crud.service';

class TodoModel {
  field?: unknown;
}

const config = {
  apiUrl: '/api/todos',
  entity: 'todos-filter',
  type: TodoModel,
};

function buildItem(fieldType?: FieldTypeDef): IModelFilter {
  return {
    key: 'field',
    type: '=',
    label: 'field.label',
    fieldType,
    possibilities: (() => [
      { id: 1, text: 'a' },
      { id: 2, text: 'b' },
    ]) as unknown as IModelFilter['possibilities'],
  };
}

function setup(item?: IModelFilter) {
  const service = {
    getList: jest.fn(() => new Promise(() => undefined)),
  };

  return render(
    <SmartProvider language="eng">
      <CrudProvider
        config={config}
        service={service as unknown as CrudService<any>}
      >
        <SmartCrudFilter item={item} filter={{ query: [] }} />
      </CrudProvider>
    </SmartProvider>,
  );
}

describe('@smartsoft001/crud-shell-react: SmartCrudFilter', () => {
  it('should wrap the field in a padding container', () => {
    const { container } = setup(buildItem(FieldType.text));

    expect(container.firstElementChild).toHaveClass('smart:py-1');
  });

  it('should render the text filter by default', () => {
    setup(buildItem());

    expect(screen.getByRole('textbox', { name: 'MODEL.field' })).toBeVisible();
  });

  it('should render the text filter for a text field', () => {
    setup(buildItem(FieldType.text));

    expect(screen.getByRole('textbox', { name: 'MODEL.field' })).toBeVisible();
  });

  it('should render the int filter for an int field', () => {
    setup(buildItem(FieldType.int));

    expect([
      screen.getByRole('spinbutton', { name: 'MODEL.field' }),
      screen.getByRole('button', { name: 'settings' }),
    ]).toHaveLength(2);
  });

  it('should render the check filter for a check field', () => {
    setup(buildItem(FieldType.check));

    expect(
      screen.getAllByRole('checkbox').map((box) => box.closest('label')),
    ).toEqual([
      screen.getByText('a').closest('label'),
      screen.getByText('b').closest('label'),
    ]);
  });

  it('should render the radio filter for a radio field', () => {
    setup(buildItem(FieldType.radio));

    expect(screen.getAllByRole('radio')).toHaveLength(2);
  });

  it('should render the flag filter for a flag field', () => {
    setup(buildItem(FieldType.flag));

    expect(screen.getByRole('checkbox', { name: 'MODEL.field' })).toBeVisible();
  });

  it('should render the date filter for a date field', () => {
    setup(buildItem(FieldType.date));

    expect(screen.getAllByRole('spinbutton')).toHaveLength(8);
    expect(
      screen.queryByRole('button', { name: 'advanced' }),
    ).not.toBeInTheDocument();
  });

  it('should render the date-with-edit filter for a dateWithEdit field', () => {
    setup(buildItem(FieldType.dateWithEdit));

    expect(screen.getByRole('button', { name: 'advanced' })).toBeVisible();
  });

  it('should render the date-time filter for a dateTime field', () => {
    setup(buildItem(FieldType.dateTime));

    expect([
      screen.getByLabelText('from'),
      screen.getByLabelText('to'),
    ]).toEqual([
      expect.objectContaining({ type: 'datetime-local' }),
      expect.objectContaining({ type: 'datetime-local' }),
    ]);
  });

  it('should render the text filter without an item', () => {
    setup(undefined);

    expect(screen.getByRole('textbox')).toBeVisible();
  });
});
