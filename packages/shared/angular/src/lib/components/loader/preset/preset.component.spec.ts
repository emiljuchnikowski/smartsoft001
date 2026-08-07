import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderPresetComponent } from './preset.component';

describe('@smartsoft001/shared-angular: LoaderPresetComponent', () => {
  let fixture: ComponentFixture<LoaderPresetComponent>;
  let component: LoaderPresetComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoaderPresetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoaderPresetComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('show', true);
    fixture.detectChanges();
  });

  function spinner(): HTMLElement {
    return fixture.nativeElement.querySelector('[role="status"]');
  }

  it('should create an instance', () => {
    expect(component).toBeInstanceOf(LoaderPresetComponent);
  });

  it('should NOT render anything when show is false', () => {
    fixture.componentRef.setInput('show', false);
    fixture.detectChanges();

    expect(spinner()).toBeNull();
  });

  it('should render the default spinner with an accessible label', () => {
    expect(spinner()).toBeTruthy();
    expect(spinner().getAttribute('aria-label')).toBe('loading');
    expect(spinner().querySelector('.smart\\:sr-only')?.textContent).toContain(
      'Loading',
    );
  });

  it('should apply the bordered-ring spinner classes', () => {
    const cls = spinner().className;

    expect(cls).toContain('smart:animate-spin');
    expect(cls).toContain('smart:border-current');
    expect(cls).toContain('smart:border-t-transparent');
    expect(cls).toContain('smart:rounded-full');
  });

  it('should default to size md and indigo color', () => {
    const cls = spinner().className;

    expect(cls).toContain('smart:size-6');
    expect(cls).toContain('smart:text-indigo-600');
  });

  it('should apply size classes', () => {
    fixture.componentRef.setInput('size', 'xl');
    fixture.detectChanges();

    expect(spinner().className).toContain('smart:size-10');
  });

  it('should apply color classes with a dark variant', () => {
    fixture.componentRef.setInput('color', 'rose');
    fixture.detectChanges();

    const cls = spinner().className;

    expect(cls).toContain('smart:text-rose-600');
    expect(cls).toContain('smart:dark:text-rose-500');
  });

  it('should apply cssClass on the spinner (canonical name for NgComponentOutlet)', () => {
    fixture.componentRef.setInput('cssClass', 'my-extra-class');
    fixture.detectChanges();

    expect(spinner().className).toContain('my-extra-class');
  });
});
