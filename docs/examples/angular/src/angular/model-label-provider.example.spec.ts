import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { IModelLabelProvider, ModelLabelPipe } from '@smartsoft001/angular';

import {
  DocsModelLabelProvider,
  provideDocsModelLabels,
} from './model-label-provider.example';

describe('docs-examples-angular: DocsModelLabelProvider', () => {
  let pipe: ModelLabelPipe<unknown>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideTranslateService(),
        ...provideDocsModelLabels(),
        ModelLabelPipe,
      ],
    });

    pipe = TestBed.inject(ModelLabelPipe);
  });

  it('should register the example class against the IModelLabelProvider token', () => {
    const provider = TestBed.inject(IModelLabelProvider);

    expect(provider).toBeInstanceOf(DocsModelLabelProvider);
  });

  it('should return the mapped label for a key the provider knows', () => {
    const label = pipe.transform({}, 'email');

    expect(label).toBe('Adres e-mail');
  });

  it('should fall back to the MODEL.<key> translation for an unmapped key', () => {
    const label = pipe.transform({}, 'name');

    expect(label).toBe('MODEL.name');
  });

  it('should expose the label as a signal so callers can read it reactively', () => {
    const provider = TestBed.inject(IModelLabelProvider);

    const label = provider.get({ key: 'email' });

    expect(label()).toBe('Adres e-mail');
  });

  it('should return an empty signal value for an unmapped key', () => {
    const provider = TestBed.inject(IModelLabelProvider);

    const label = provider.get({ key: 'name' });

    expect(label()).toBe('');
  });
});
