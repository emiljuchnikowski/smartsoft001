import { ActionsSubject } from '@ngrx/store';
import { of } from 'rxjs';

import { CrudEffects } from './crud.effects';

function createEffects(actions$: ActionsSubject, entity: string) {
  const service = {
    getById: jest.fn().mockResolvedValue({ id: '1' }),
  };
  const store = { dispatch: jest.fn(), pipe: jest.fn(() => of({})) };
  const state = { getValue: () => ({}) };

  const effects = new CrudEffects<any>(
    actions$,
    service as any,
    { entity } as any,
    store as any,
    state as any,
  );

  return { effects, service };
}

describe('crud-shell-angular: CrudEffects', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should register effects separately for each ActionsSubject (one per app instance)', () => {
    const entity = 'XPerSubject';
    const subjectA = new ActionsSubject();
    const subjectB = new ActionsSubject();
    const a = createEffects(subjectA, entity);
    const b = createEffects(subjectB, entity);

    a.effects.init();
    b.effects.init();
    subjectA.next({ type: `[${entity}] Select`, id: '1' } as any);
    subjectB.next({ type: `[${entity}] Select`, id: '1' } as any);

    expect(a.service.getById).toHaveBeenCalledTimes(1);
    expect(b.service.getById).toHaveBeenCalledTimes(1);
  });

  it('should register effects only once for the same ActionsSubject and entity', () => {
    const entity = 'XSameSubject';
    const subject = new ActionsSubject();
    const a = createEffects(subject, entity);
    const b = createEffects(subject, entity);

    a.effects.init();
    b.effects.init();
    subject.next({ type: `[${entity}] Select`, id: '1' } as any);

    expect(
      a.service.getById.mock.calls.length + b.service.getById.mock.calls.length,
    ).toBe(1);
  });
});
