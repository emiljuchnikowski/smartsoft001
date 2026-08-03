import { ChangeDetectorRef, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  getMediaObjectBodyClasses,
  getMediaObjectMediaClasses,
  getMediaObjectRootClasses,
} from './preset-classes.util';
import { MediaObjectPresetComponent } from './preset.component';
import { IMediaObjectOptions } from '../../../models';

@Component({
  selector: 'smart-test-host',
  template: `<smart-media-object-preset
    [mediaUrl]="mediaUrl"
    [mediaAlt]="mediaAlt"
    [options]="options"
    [class]="cssClass"
  >
    <span class="projected-body">Body content</span>
  </smart-media-object-preset>`,
  imports: [MediaObjectPresetComponent],
})
class TestHostComponent {
  mediaUrl = 'https://example.com/image.png';
  mediaAlt = 'Example image';
  options: IMediaObjectOptions | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: MediaObjectPresetComponent', () => {
  describe('getMediaObjectRootClasses (util)', () => {
    it('should return the flex row base with gap-4 when no options', () => {
      const classes = getMediaObjectRootClasses(undefined);

      expect(classes).toContain('smart:flex');
      expect(classes).toContain('smart:gap-4');
    });

    it('should reverse the row when position is right', () => {
      const classes = getMediaObjectRootClasses({ position: 'right' });

      expect(classes).toContain('smart:flex-row-reverse');
    });

    it('should not reverse the row when position is left', () => {
      const classes = getMediaObjectRootClasses({ position: 'left' });

      expect(classes).not.toContain('smart:flex-row-reverse');
    });

    it('should map alignment "top" to items-start', () => {
      const classes = getMediaObjectRootClasses({ alignment: 'top' });

      expect(classes).toContain('smart:items-start');
    });

    it('should map alignment "center" to items-center', () => {
      const classes = getMediaObjectRootClasses({ alignment: 'center' });

      expect(classes).toContain('smart:items-center');
    });

    it('should map alignment "bottom" to items-end', () => {
      const classes = getMediaObjectRootClasses({ alignment: 'bottom' });

      expect(classes).toContain('smart:items-end');
    });

    it('should not add an items-* class for alignment "stretched"', () => {
      const classes = getMediaObjectRootClasses({ alignment: 'stretched' });

      expect(classes).not.toContain('smart:items-start');
      expect(classes).not.toContain('smart:items-center');
      expect(classes).not.toContain('smart:items-end');
    });

    it('should fold to a column then row on sm when responsive', () => {
      const classes = getMediaObjectRootClasses({ responsive: true });

      expect(classes).toContain('smart:flex-col');
      expect(classes).toContain('smart:sm:flex-row');
    });

    it('should fold to a column then reversed row on sm when responsive and right', () => {
      const classes = getMediaObjectRootClasses({
        responsive: true,
        position: 'right',
      });

      expect(classes).toContain('smart:flex-col');
      expect(classes).toContain('smart:sm:flex-row-reverse');
    });

    it('should use a tighter gap-3 when nested', () => {
      const classes = getMediaObjectRootClasses({ nested: true });

      expect(classes).toContain('smart:gap-3');
      expect(classes).not.toContain('smart:gap-4');
    });

    it('should indent nested media objects with a top margin', () => {
      const classes = getMediaObjectRootClasses({ nested: true });

      expect(classes).toContain('smart:mt-4');
    });
  });

  describe('getMediaObjectMediaClasses (util)', () => {
    it('should default the media to a rounded square that never shrinks', () => {
      const classes = getMediaObjectMediaClasses(undefined);

      expect(classes).toContain('smart:size-16');
      expect(classes).toContain('smart:rounded-lg');
      expect(classes).toContain('smart:object-cover');
      expect(classes).toContain('smart:shrink-0');
    });

    it('should widen the media to w-32 with a sensible height when wide', () => {
      const classes = getMediaObjectMediaClasses({ wide: true });

      expect(classes).toContain('smart:w-32');
      expect(classes).toContain('smart:h-16');
      expect(classes).not.toContain('smart:size-16');
    });

    it('should stretch the media to fill the row when alignment is stretched', () => {
      const classes = getMediaObjectMediaClasses({ alignment: 'stretched' });

      expect(classes).toContain('smart:self-stretch');
      expect(classes).toContain('smart:h-auto');
    });
  });

  describe('getMediaObjectBodyClasses (util)', () => {
    it('should render the body as small muted text with a dark variant', () => {
      const classes = getMediaObjectBodyClasses();

      expect(classes).toContain('smart:text-sm');
      expect(classes).toContain('smart:text-gray-700');
      expect(classes).toContain('smart:dark:text-gray-300');
    });
  });

  describe('rendering', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let host: TestHostComponent;

    const root = () =>
      (fixture.nativeElement as HTMLElement).querySelector(
        '[data-role="root"]',
      ) as HTMLElement;
    const media = () =>
      (fixture.nativeElement as HTMLElement).querySelector(
        '[data-role="media"]',
      ) as HTMLImageElement;
    const body = () =>
      (fixture.nativeElement as HTMLElement).querySelector(
        '[data-role="body"]',
      ) as HTMLElement;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TestHostComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(TestHostComponent);
      host = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should expose data-role hooks for root, media and body', () => {
      expect(root()).toBeTruthy();
      expect(media()).toBeTruthy();
      expect(body()).toBeTruthy();
    });

    it('should land the mediaUrl on the img src', () => {
      expect(media().getAttribute('src')).toBe('https://example.com/image.png');
    });

    it('should land the mediaAlt on the img alt', () => {
      expect(media().getAttribute('alt')).toBe('Example image');
    });

    it('should project content into the body slot', () => {
      expect(body().querySelector('.projected-body')).toBeTruthy();
      expect(body().textContent).toContain('Body content');
    });

    it('should preserve the standard body marker class', () => {
      expect(body().classList).toContain('smart-media-object-body');
    });

    it('should apply the preset root classes on the root element', () => {
      expect(root().className).toContain('smart:flex');
      expect(root().className).toContain('smart:gap-4');
    });

    it('should merge the external cssClass onto the root element', async () => {
      host.cssClass = 'my-extra-class';
      fixture.debugElement.injector.get(ChangeDetectorRef).markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(root().className).toContain('my-extra-class');
      expect(root().className).toContain('smart:flex');
    });

    it('should reflect options.position on the root via data-position', async () => {
      host.options = { position: 'right' };
      fixture.debugElement.injector.get(ChangeDetectorRef).markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(root().getAttribute('data-position')).toBe('right');
      expect(root().className).toContain('smart:flex-row-reverse');
    });

    it('should reflect options.alignment on the root via data-alignment', async () => {
      host.options = { alignment: 'center' };
      fixture.debugElement.injector.get(ChangeDetectorRef).markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(root().getAttribute('data-alignment')).toBe('center');
      expect(root().className).toContain('smart:items-center');
    });

    it('should widen the media element when options.wide is set', async () => {
      host.options = { wide: true };
      fixture.debugElement.injector.get(ChangeDetectorRef).markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(media().className).toContain('smart:w-32');
    });

    it('should fold the root to responsive column layout when options.responsive is set', async () => {
      host.options = { responsive: true };
      fixture.debugElement.injector.get(ChangeDetectorRef).markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(root().className).toContain('smart:flex-col');
      expect(root().className).toContain('smart:sm:flex-row');
    });
  });
});
