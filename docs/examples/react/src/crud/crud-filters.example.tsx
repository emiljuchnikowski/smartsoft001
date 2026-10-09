// #region usage
import {
  CrudFullConfig,
  CrudProvider,
  SmartCrudFilters,
  SmartCrudListPage,
} from '@smartsoft001/crud-shell-react';
import { IEntity } from '@smartsoft001/domain-core';
import { Field, FieldType, Model } from '@smartsoft001/models';

@Model({ titleKey: 'title' })
export class Article implements IEntity<string> {
  id!: string;

  // `search` makes the backend match the search text against this field;
  // `list.filter` gives it a filter, `~=` (contains) because it is text.
  @Field({
    type: FieldType.text,
    list: { filter: true },
    search: true,
    details: true,
  })
  title!: string;
}

export const articlesConfig: CrudFullConfig<Article> = {
  apiUrl: 'https://api.example.com/articles',
  entity: 'articles',
  type: Article,
  title: 'Articles',
  search: true,
  pagination: { limit: 10 },
  // Sent with every read whose filter has no query of its own; `hidden`
  // keeps it out of the active-filter chips.
  baseQuery: [{ key: 'archived', type: '=', value: false, hidden: true }],
};

// The filters panel always visible beside the list, instead of in the end
// menu the filters button of the page opens.
export function ArticlesWithFilters() {
  return (
    <CrudProvider config={articlesConfig}>
      <SmartCrudFilters hideMenu />
      <SmartCrudListPage basePath="/articles" />
    </CrudProvider>
  );
}
// #endregion
