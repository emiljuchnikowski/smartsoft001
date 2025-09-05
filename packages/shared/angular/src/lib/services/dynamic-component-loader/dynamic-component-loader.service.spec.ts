import {
  ComponentFactoryResolver,
  Injector,
  ComponentFactory,
} from '@angular/core';

import { DynamicComponentLoader } from './dynamic-component-loader.service';

describe('angular: DynamicComponentLoader', () => {
  let resolver: ComponentFactoryResolver;
  let injector: Injector;
  let loader: DynamicComponentLoader<any>;

  beforeEach(() => {
    resolver = {
      resolveComponentFactory: jest.fn(
        (comp) => ({ componentType: comp }) as ComponentFactory<any>,
      ),
    } as any;
    injector = {} as Injector;
    loader = new DynamicComponentLoader(resolver, injector);
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

  it('should call resolver for each component', async () => {
    const compA = { name: 'A' };
    const compB = { name: 'B' };
    await loader.getComponentsWithFactories({ components: [compA, compB] });
    expect(resolver.resolveComponentFactory).toHaveBeenCalledWith(compA);
    expect(resolver.resolveComponentFactory).toHaveBeenCalledWith(compB);
  });

  it('should return correct factory for each component', async () => {
    const compA = { name: 'A' };
    const compB = { name: 'B' };
    const result = await loader.getComponentsWithFactories({
      components: [compA, compB],
    });
    expect(result[0].factory.componentType).toBe(compA);
    expect(result[1].factory.componentType).toBe(compB);
  });
});
