import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateRangeCustomExampleComponent } from './custom.example';

describe('docs-examples-angular: DateRangeCustomExampleComponent', () => {
  let fixture: ComponentFixture<DateRangeCustomExampleComponent>;
  let component: DateRangeCustomExampleComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateRangeCustomExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DateRangeCustomExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render the custom picker built on the base class', () => {
    const host = fixture.nativeElement.querySelector('docs-custom-date-range');

    expect(host).toBeTruthy();
    expect(host.querySelector('.docs-date-range__trigger')).toBeTruthy();
  });

  it('should show the range bound by the host on the trigger', () => {
    const trigger = fixture.nativeElement.querySelector(
      '.docs-date-range__trigger',
    );

    expect(trigger.textContent).toContain('2026-04-01 - 2026-04-07');
  });

  it('should open the panel through the base onClick() handler', () => {
    expect(
      fixture.nativeElement.querySelector('.docs-date-range__panel'),
    ).toBeNull();

    fixture.nativeElement.querySelector('.docs-date-range__trigger').click();
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('.docs-date-range__panel'),
    ).toBeTruthy();
  });

  it('should clear the range back to the host through the base onClear()', () => {
    fixture.nativeElement.querySelector('.docs-date-range__clear').click();

    expect(component.range()).toBeUndefined();
  });
});
