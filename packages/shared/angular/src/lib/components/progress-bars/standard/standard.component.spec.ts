import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressBarsStandardComponent } from './standard.component';
import { IProgressStepClick } from '../base/base.component';

describe('@smartsoft001/shared-angular: ProgressBarsStandardComponent', () => {
  let fixture: ComponentFixture<ProgressBarsStandardComponent>;
  let component: ProgressBarsStandardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressBarsStandardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgressBarsStandardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render <nav.progress-bars> by default', () => {
    const nav = fixture.nativeElement.querySelector('nav.progress-bars');

    expect(nav).toBeTruthy();
    expect(nav.getAttribute('aria-label')).toBe('Progress');
  });

  it('should set data-layout from options.layout', () => {
    fixture.componentRef.setInput('options', { layout: 'circles', steps: [] });
    fixture.detectChanges();

    const nav = fixture.nativeElement.querySelector('nav.progress-bars');

    expect(nav.getAttribute('data-layout')).toBe('circles');
  });

  it('should default data-layout to "simple"', () => {
    fixture.componentRef.setInput('options', { steps: [] });
    fixture.detectChanges();

    const nav = fixture.nativeElement.querySelector('nav.progress-bars');

    expect(nav.getAttribute('data-layout')).toBe('simple');
  });

  it('should render anchor when step.href provided', () => {
    fixture.componentRef.setInput('options', {
      steps: [
        {
          id: 's1',
          name: 'Step 1',
          href: '/step1',
          status: 'current',
        },
      ],
    });
    fixture.detectChanges();

    const link: HTMLAnchorElement = fixture.nativeElement.querySelector(
      'a.progress-bars-step-link',
    );

    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toBe('/step1');
    expect(link.getAttribute('aria-current')).toBe('step');
    expect(link.className).toContain('current');
    expect(link.textContent).toContain('Step 1');
  });

  it('should render button when step has no href', () => {
    fixture.componentRef.setInput('options', {
      steps: [{ id: 's1', name: 'Step 1' }],
    });
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector(
      'button.progress-bars-step-button',
    );

    expect(button).toBeTruthy();
    expect(button.textContent).toContain('Step 1');
  });

  it('should emit stepClick on button-type step click', () => {
    fixture.componentRef.setInput('options', {
      steps: [{ id: 's2', name: 'Step 2' }],
    });
    fixture.detectChanges();

    const emitted: IProgressStepClick[] = [];
    component.stepClick.subscribe((v) => emitted.push(v));

    const button: HTMLButtonElement = fixture.nativeElement.querySelector(
      'button.progress-bars-step-button',
    );
    button.click();

    expect(emitted.length).toBe(1);
    expect(emitted[0]).toEqual({ stepId: 's2' });
  });

  it('should set data-status for each step', () => {
    fixture.componentRef.setInput('options', {
      steps: [
        { id: 's1', status: 'complete' },
        { id: 's2', status: 'current' },
        { id: 's3', status: 'upcoming' },
      ],
    });
    fixture.detectChanges();

    const items = fixture.nativeElement.querySelectorAll('.progress-bars-step');

    expect(items.length).toBe(3);
    expect(items[0].getAttribute('data-status')).toBe('complete');
    expect(items[1].getAttribute('data-status')).toBe('current');
    expect(items[2].getAttribute('data-status')).toBe('upcoming');
  });

  it('should default step status to "upcoming" when not provided', () => {
    fixture.componentRef.setInput('options', {
      steps: [{ id: 's1', name: 'A' }],
    });
    fixture.detectChanges();

    const item = fixture.nativeElement.querySelector('.progress-bars-step');

    expect(item.getAttribute('data-status')).toBe('upcoming');
  });

  it('should render step description when provided', () => {
    fixture.componentRef.setInput('options', {
      steps: [
        { id: 's1', name: 'Job', description: 'Vitae sed mi.', href: '/' },
      ],
    });
    fixture.detectChanges();

    const desc = fixture.nativeElement.querySelector(
      '.progress-bars-step-description',
    );

    expect(desc.textContent.trim()).toBe('Vitae sed mi.');
  });

  it('should render step index when provided and no iconTpl', () => {
    fixture.componentRef.setInput('options', {
      steps: [{ id: 's2', name: 'Step', index: '02', href: '/' }],
    });
    fixture.detectChanges();

    const idx = fixture.nativeElement.querySelector(
      '.progress-bars-step-index',
    );

    expect(idx.textContent.trim()).toBe('02');
  });

  it('should render <progressbar> bar layout when layout="progress-bar"', () => {
    fixture.componentRef.setInput('options', {
      layout: 'progress-bar',
      title: 'Migrating MySQL database...',
      value: 37.5,
    });
    fixture.detectChanges();

    const wrapper = fixture.nativeElement.querySelector(
      '.progress-bars-bar-wrapper',
    );
    const fill: HTMLDivElement = fixture.nativeElement.querySelector(
      '.progress-bars-fill',
    );
    const title = fixture.nativeElement.querySelector('.progress-bars-title');

    expect(wrapper).toBeTruthy();
    expect(fill).toBeTruthy();
    expect(fill.style.width).toBe('37.5%');
    expect(fill.getAttribute('role')).toBe('progressbar');
    expect(fill.getAttribute('aria-valuenow')).toBe('37.5');
    expect(title.textContent.trim()).toBe('Migrating MySQL database...');
    // Should not render the step <nav>
    expect(fixture.nativeElement.querySelector('nav.progress-bars')).toBeNull();
  });

  it('should clamp progress-bar value to [0, 100]', () => {
    fixture.componentRef.setInput('options', {
      layout: 'progress-bar',
      value: 150,
    });
    fixture.detectChanges();

    const fill: HTMLDivElement = fixture.nativeElement.querySelector(
      '.progress-bars-fill',
    );

    expect(fill.style.width).toBe('100%');
  });

  it('should render columns labels in progress-bar layout', () => {
    fixture.componentRef.setInput('options', {
      layout: 'progress-bar',
      value: 50,
      columns: [
        { label: 'Copying files', active: true },
        { label: 'Migrating', active: false },
      ],
    });
    fixture.detectChanges();

    const cols = fixture.nativeElement.querySelectorAll(
      '.progress-bars-column',
    );

    expect(cols.length).toBe(2);
    expect(cols[0].textContent.trim()).toBe('Copying files');
    expect(cols[0].className).toContain('active');
    expect(cols[1].className).not.toContain('active');
  });

  it('should apply external cssClass on wrapper', () => {
    fixture.componentRef.setInput('class', 'extra');
    fixture.componentRef.setInput('options', { steps: [] });
    fixture.detectChanges();

    const wrapper = fixture.nativeElement.firstElementChild as HTMLElement;

    expect(wrapper.className).toContain('extra');
  });
});
