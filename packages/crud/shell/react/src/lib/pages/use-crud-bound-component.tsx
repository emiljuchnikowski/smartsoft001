import { useMemo } from 'react';
import type { ComponentType } from 'react';

import {
  SmartContext,
  SmartContextValue,
  useFileService,
  useSmart,
} from '@smartsoft001/react';

import { CrudContext, useCrud } from '../crud.context';

/**
 * `Component` bound to the CRUD feature of the caller: wherever it is
 * rendered (the end menu of `MenuService.openEnd`, a modal of
 * `ModalService.show`, both rendered outside the `CrudProvider`), it reads
 * the caller's feature (`useCrud()`) and the feature's file service. Props
 * are passed through, e.g. the `dismiss` of a modal.
 */
export function useCrudBoundComponent<P extends object>(
  Component: ComponentType<P>,
): ComponentType<P> {
  const crud = useCrud();
  const fileService = useFileService();

  return useMemo(() => {
    function CrudBoundComponent(props: P) {
      const smart = useSmart();
      const value = useMemo<SmartContextValue>(
        () => ({ ...smart, fileService }),
        [smart],
      );

      return (
        <SmartContext.Provider value={value}>
          <CrudContext.Provider value={crud}>
            <Component {...props} />
          </CrudContext.Provider>
        </SmartContext.Provider>
      );
    }

    return CrudBoundComponent;
  }, [Component, crud, fileService]);
}
