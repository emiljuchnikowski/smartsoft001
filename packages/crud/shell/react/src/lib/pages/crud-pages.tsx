import { useEffect, useState } from 'react';

import { useNavigation } from '@smartsoft001/react';

import { SmartCrudItemPage } from './item/item-page';
import { SmartCrudListPage } from './list/list-page';

/** The page of a CRUD feature a URL leads to (see `matchCrudRoute`). */
export type CrudRoute = { page: 'list' } | { page: 'item'; id?: string };

/** The path without the query string, the hash and trailing slashes. */
function normalizePath(path: string): string {
  return path.split(/[?#]/)[0].replace(/\/+$/, '') || '/';
}

/**
 * The CRUD page that `url` leads to, relative to `basePath`: `basePath` is
 * the list, `basePath/add` the item page creating an item, `basePath/:id` the
 * item page of `id`. `null` for any other URL.
 */
export function matchCrudRoute(
  url: string,
  basePath: string,
): CrudRoute | null {
  const path = normalizePath(url);
  const base = normalizePath(basePath);

  if (path === base) return { page: 'list' };

  const prefix = base === '/' ? '/' : base + '/';

  if (!path.startsWith(prefix)) return null;

  const segment = path.slice(prefix.length);

  if (!segment || segment.includes('/')) return null;

  if (segment === 'add') return { page: 'item' };

  return { page: 'item', id: decodeURIComponent(segment) };
}

export interface SmartCrudPagesProps {
  /** The path the CRUD feature is mounted at, e.g. `/notes`. */
  basePath: string;
}

/**
 * The CRUD pages without a router: renders `SmartCrudListPage` on
 * `basePath`, `SmartCrudItemPage` creating an item on `basePath/add` and
 * `SmartCrudItemPage` of the item on `basePath/:id`, following the URL of
 * `useNavigation()` (`getCurrentUrl()` + `subscribe`).
 * Renders nothing on any other URL. Render it inside the `CrudProvider` of
 * the feature.
 *
 * An application with a router can render the two pages from its own routes
 * instead: `<SmartCrudListPage basePath="/notes" />` on `/notes`,
 * `<SmartCrudItemPage basePath="/notes" />` on `/notes/add` and
 * `<SmartCrudItemPage id={id} basePath="/notes" />` on `/notes/:id`.
 */
export function SmartCrudPages({ basePath }: SmartCrudPagesProps) {
  const navigation = useNavigation();
  const [url, setUrl] = useState(() => navigation.getCurrentUrl());

  useEffect(() => {
    setUrl(navigation.getCurrentUrl());

    return navigation.subscribe(setUrl);
  }, [navigation]);

  const route = matchCrudRoute(url, basePath);

  if (!route) return null;

  if (route.page === 'list') return <SmartCrudListPage basePath={basePath} />;

  // The page is created anew between `add` and an id; between two ids the
  // same page stays and gets the new `id`.
  return (
    <SmartCrudItemPage
      key={route.id === undefined ? 'add' : 'item'}
      id={route.id}
      basePath={basePath}
    />
  );
}
