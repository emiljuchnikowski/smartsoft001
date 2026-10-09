import { ChangeDetectionStrategy, Component, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import * as fs from 'node:fs';
import * as path from 'node:path';

import { provideSmartPresets, SMART_PRESET_PROVIDERS } from './presets';
import * as tokens from '../../shared.inectors';
import { BadgeComponent } from '../badge/badge.component';
import { PagePresetComponent } from '../page/preset/preset.component';

describe('shared-angular: provideSmartPresets', () => {
  const componentsDir = path.join(__dirname, '..');

  /** The component directories that ship a `preset/preset.component.ts`. */
  const presetDirs = fs
    .readdirSync(componentsDir)
    .filter((dir) =>
      fs.existsSync(
        path.join(componentsDir, dir, 'preset/preset.component.ts'),
      ),
    );

  const provided = new Map(
    SMART_PRESET_PROVIDERS.map((provider) => {
      const { provide, useValue } = provider as {
        provide: unknown;
        useValue: unknown;
      };

      return [provide, useValue];
    }),
  );

  it('should register the preset of every component that has a token and a preset', () => {
    // Arrange
    const missing: string[] = [];

    // Act
    for (const dir of presetDirs) {
      const tokenName = `${dir.toUpperCase().replace(/-/g, '_')}_STANDARD_COMPONENT_TOKEN`;
      const token = (tokens as Record<string, unknown>)[tokenName];

      if (token && !provided.has(token)) missing.push(tokenName);
    }

    // Assert
    expect(missing).toEqual([]);
  });

  it('should render the preset page for the standard variant too', () => {
    // Act
    const variants = provided.get(tokens.PAGE_VARIANT_COMPONENTS_TOKEN) as
      Record<string, Type<unknown>> | undefined;

    // Assert
    expect(variants?.['standard']).toBe(PagePresetComponent);
    expect(variants?.['preset']).toBe(PagePresetComponent);
  });

  it('should restyle a wrapper rendered under the providers', async () => {
    // Arrange
    @Component({
      selector: 'smart-test-host',
      imports: [BadgeComponent],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: '<smart-badge text="Active" />',
    })
    class HostComponent {}

    TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [provideSmartPresets()],
    });
    const fixture = TestBed.createComponent(HostComponent);

    // Act
    fixture.detectChanges();
    await fixture.whenStable();

    // Assert
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('smart-badge-preset')).not.toBeNull();
    expect(element.querySelector('smart-badge-standard')).toBeNull();
  });
});
