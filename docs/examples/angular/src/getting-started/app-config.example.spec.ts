import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';

import {
  BUTTON_STANDARD_COMPONENT_TOKEN,
  ButtonPresetComponent,
  ToastService,
} from '@smartsoft001/angular';

import { appConfig } from './app-config.example';

describe('docs-examples-angular: appConfig', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: appConfig.providers });
  });

  it('should provide TranslateService', () => {
    const translateService = TestBed.inject(TranslateService);

    expect(translateService).toBeInstanceOf(TranslateService);
  });

  it('should provide services exported by SharedModule', () => {
    const toastService = TestBed.inject(ToastService);

    expect(toastService).toBeInstanceOf(ToastService);
  });

  it('should register the built-in translations when SharedModule boots', () => {
    const translateService = TestBed.inject(TranslateService);

    expect(translateService.getLangs()).toContain('pl');
  });

  it('should register the preset implementations', () => {
    const button = TestBed.inject(BUTTON_STANDARD_COMPONENT_TOKEN);

    expect(button).toBe(ButtonPresetComponent);
  });
});
