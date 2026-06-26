import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressBarsPresetComponent } from './preset.component';
import { IProgressBarsOptions } from '../../../models';

describe('@smartsoft001/shared-angular: ProgressBarsPresetComponent', () => {
  let fixture: ComponentFixture<ProgressBarsPresetComponent>;
  let component: ProgressBarsPresetComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressBarsPresetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgressBarsPresetComponent);
    component = fixture.componentInstance;
  });

  function setOptions(options: IProgressBarsOptions): void {
    fixture.componentRef.setInput('options', options);
    fixture.detectChanges();
  }

  it('should create an instance', () => {
    fixture.detectChanges();
    expect(component).toBeInstanceOf(ProgressBarsPresetComponent);
  });

  describe('progress-bar mode', () => {
    it('should render the track and fill with the clamped width', () => {
      setOptions({ layout: 'progress-bar', value: 25 });

      const bar = fixture.nativeElement.querySelector(
        '[role="progressbar"]',
      ) as HTMLElement;
      const fill = bar.querySelector('div') as HTMLElement;

      expect(bar.getAttribute('aria-valuenow')).toBe('25');
      expect(fill.style.width).toBe('25%');
      expect(fill.className).toContain('smart:bg-blue-600');
    });

    it('should clamp out-of-range values into [0, 100]', () => {
      setOptions({ layout: 'progress-bar', value: 150 });

      const bar = fixture.nativeElement.querySelector('[role="progressbar"]');

      expect(bar.getAttribute('aria-valuenow')).toBe('100');
    });

    it('should render a title header with the percentage label', () => {
      setOptions({ layout: 'progress-bar', value: 50, title: 'Uploading' });

      const heading = fixture.nativeElement.querySelector('h3');
      const value = fixture.nativeElement.querySelector('h3 + span');

      expect(heading.textContent).toContain('Uploading');
      expect(value.textContent).toContain('50%');
    });

    it('should render a screen-reader-only title', () => {
      setOptions({ layout: 'progress-bar', value: 10, srOnlyTitle: 'Loading' });

      const sr = fixture.nativeElement.querySelector('h4.smart\\:sr-only');

      expect(sr.textContent).toContain('Loading');
    });

    it('should render column captions and highlight active ones', () => {
      setOptions({
        layout: 'progress-bar',
        value: 50,
        columns: [
          { label: 'Start' },
          { label: 'Half', active: true },
          { label: 'End' },
        ],
      });

      const cols = fixture.nativeElement.querySelectorAll(
        '[style*="grid-template-columns"] > div',
      );

      expect(cols.length).toBe(3);
      expect((cols[1] as HTMLElement).className).toContain(
        'smart:font-semibold',
      );
    });
  });

  describe('step-list mode', () => {
    const steps = [
      { id: 'a', name: 'Account', status: 'complete' as const },
      { id: 'b', name: 'Profile', status: 'current' as const, index: '2' },
      { id: 'c', name: 'Done', status: 'upcoming' as const },
    ];

    it('should render one list item per step', () => {
      setOptions({ layout: 'circles-with-text', steps });

      const items = fixture.nativeElement.querySelectorAll('li');

      // 3 steps, vertical layout has no connector list items.
      expect(items.length).toBe(3);
    });

    it('should render a check icon for a completed circle step', () => {
      setOptions({ layout: 'circles', steps });

      const check = fixture.nativeElement.querySelector('svg polyline');

      expect(check).toBeTruthy();
    });

    it('should render the step index for a current circle step', () => {
      setOptions({ layout: 'circles', steps });

      expect(fixture.nativeElement.textContent).toContain('2');
    });

    it('should apply current name styling to the current step', () => {
      setOptions({ layout: 'circles-with-text', steps });

      const html = fixture.nativeElement.innerHTML;

      expect(html).toContain('smart:text-blue-600');
    });

    it('should emit stepClick when a step button is clicked', () => {
      setOptions({ layout: 'simple', steps });

      let emitted: string | undefined;
      component.stepClick.subscribe((e) => (emitted = e.stepId));

      fixture.nativeElement.querySelector('button')?.click();

      expect(emitted).toBe('a');
    });

    it('should render an anchor instead of a button when href is set', () => {
      setOptions({
        layout: 'simple',
        steps: [{ id: 'a', name: 'Account', href: '/account' }],
      });

      const anchor = fixture.nativeElement.querySelector('a[href="/account"]');

      expect(anchor).toBeTruthy();
    });

    it('should render connectors for horizontal circle layouts', () => {
      setOptions({ layout: 'circles', steps });

      const connectors = fixture.nativeElement.querySelectorAll(
        'li[aria-hidden="true"]',
      );

      // 3 steps -> 2 connectors between them.
      expect(connectors.length).toBe(2);
    });
  });

  it('should apply cssClass by canonical name (NgComponentOutlet)', () => {
    fixture.componentRef.setInput('options', {
      layout: 'progress-bar',
      value: 0,
    });
    fixture.componentRef.setInput('cssClass', 'my-extra-class');
    fixture.detectChanges();

    const root = fixture.nativeElement.firstElementChild as HTMLElement;

    expect(root.className).toContain('my-extra-class');
  });
});
