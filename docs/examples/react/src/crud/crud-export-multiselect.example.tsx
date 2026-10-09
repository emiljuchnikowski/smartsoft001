// #region usage
import {
  CrudFullConfig,
  CrudProvider,
  SmartCrudListPage,
} from '@smartsoft001/crud-shell-react';
import { IEntity } from '@smartsoft001/domain-core';
import { Field, FieldType, Model } from '@smartsoft001/models';
import { useMenuService, useStore } from '@smartsoft001/react';

@Model({ titleKey: 'title' })
export class Task implements IEntity<string> {
  id!: string;

  @Field({ type: FieldType.text, list: true, details: true, update: true })
  title!: string;

  // `multi` makes the field editable for a whole selection at once.
  @Field({ type: FieldType.text, list: true, update: { multi: true } })
  owner!: string;
}

export const tasksConfig: CrudFullConfig<Task> = {
  apiUrl: 'https://api.example.com/tasks',
  entity: 'tasks',
  type: Task,
  title: 'Tasks',
  edit: true,
  export: true,
  pagination: { limit: 25 },
};

// The end menu belongs to the application. The list page opens the
// multiselect panel (and the filters) in it through MenuService, bound to
// the feature, so the menu can live outside the CrudProvider.
function EndMenu() {
  const menuService = useMenuService();
  const content = useStore(menuService.endContent);

  if (!content) return null;

  const { component: Component, props } = content;

  return (
    <aside aria-label="End menu">
      <Component {...props} />
    </aside>
  );
}

export function TasksScreen() {
  return (
    <>
      <CrudProvider config={tasksConfig}>
        <SmartCrudListPage basePath="/tasks" />
      </CrudProvider>
      <EndMenu />
    </>
  );
}
// #endregion
