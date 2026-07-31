import { ɵNoopNgZone as NoopNgZone, NgZone } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { DynamicComponentLoader } from './dynamic-component-loader.service';

describe('angular: DynamicComponentLoader', () => {
  let loader: DynamicComponentLoader<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DynamicComponentLoader,
        { provide: NgZone, useClass: NoopNgZone },
      ],
    });

    loader = TestBed.inject(DynamicComponentLoader);
    DynamicComponentLoader.declaredComponents = [];
  });

  it('should create an instance', () => {
    expect(loader).toBeInstanceOf(DynamicComponentLoader);
  });

  it('should filter out declared components', async () => {
    const compA = { name: 'A' };
    const compB = { name: 'B' };
    DynamicComponentLoader.declaredComponents = [{ component: compA }];
    const result = await loader.getComponentsWithFactories({
      components: [compA, compB],
    });
    expect(result.length).toBe(2);
  });

  it('should return the component type as factory for each component', async () => {
    const compA = { name: 'A' };
    const compB = { name: 'B' };
    const result = await loader.getComponentsWithFactories({
      components: [compA, compB],
    });
    expect(result[0].factory).toBe(compA);
    expect(result[1].factory).toBe(compB);
  });
});
