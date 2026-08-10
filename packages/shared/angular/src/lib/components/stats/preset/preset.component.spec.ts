import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsPresetComponent } from './preset.component';
import { IStatsOptions } from '../../../models';

describe('@smartsoft001/shared-angular: StatsPresetComponent', () => {
  let fixture: ComponentFixture<StatsPresetComponent>;
  let component: StatsPresetComponent;

  const OPTIONS: IStatsOptions = {
    items: [
      {
        label: 'Accuracy rate',
        value: '99.95%',
        previousValue: 'in fulfilling orders',
      },
      { label: 'Startup businesses', value: '2,000+' },
      { label: 'Happy customer', value: '85%' },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsPresetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StatsPresetComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('options', OPTIONS);
    fixture.detectChanges();
  });

  function root(): HTMLElement {
    return fixture.nativeElement.querySelector('div');
  }

  it('should create an instance', () => {
    expect(component).toBeInstanceOf(StatsPresetComponent);
  });

  it('should render one block per item with label and value', () => {
    const host = fixture.nativeElement as HTMLElement;
    const labels = Array.from(host.querySelectorAll('h4')).map((el) =>
      (el as HTMLElement).textContent?.trim(),
    );
    const values = Array.from(host.querySelectorAll('p')).map((el) =>
      (el as HTMLElement).textContent?.trim(),
    );

    expect(labels).toContain('Accuracy rate');
    expect(values.some((v) => v?.includes('99.95%'))).toBe(true);
  });

  it('should render the previousValue as a muted sub-line', () => {
    expect(root().textContent).toContain('in fulfilling orders');
  });

  it('should default to three columns', () => {
    const grid = fixture.nativeElement.querySelectorAll(
      'div',
    )[1] as HTMLElement;

    expect(grid.className).toContain('smart:lg:grid-cols-3');
  });

  it('should apply the columns count from options', () => {
    fixture.componentRef.setInput('options', { ...OPTIONS, columns: 4 });
    fixture.detectChanges();

    const grid = fixture.nativeElement.querySelectorAll(
      'div',
    )[1] as HTMLElement;

    expect(grid.className).toContain('smart:lg:grid-cols-4');
  });

  it('should render the title when provided', () => {
    fixture.componentRef.setInput('options', {
      ...OPTIONS,
      title: 'Our numbers',
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h2')?.textContent?.trim()).toBe(
      'Our numbers',
    );
  });

  it('should render a change badge coloured by trend', () => {
    fixture.componentRef.setInput('options', {
      items: [
        { label: 'Conversion', value: '92%', change: '+7%', trend: 'up' },
      ],
    } as IStatsOptions);
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('p span') as HTMLElement;

    expect(badge.textContent?.trim()).toBe('+7%');
    expect(badge.className).toContain('smart:text-green-800');
  });

  it('should set aria-label from the item when provided', () => {
    fixture.componentRef.setInput('options', {
      items: [{ label: 'Users', value: '10', ariaLabel: 'Active users' }],
    } as IStatsOptions);
    fixture.detectChanges();

    const block = fixture.nativeElement.querySelector(
      '[aria-label="Active users"]',
    );

    expect(block).toBeTruthy();
  });

  it('should apply cssClass on the host (canonical name for NgComponentOutlet)', () => {
    fixture.componentRef.setInput('cssClass', 'my-extra-class');
    fixture.detectChanges();

    expect(root().className).toContain('my-extra-class');
  });
});
