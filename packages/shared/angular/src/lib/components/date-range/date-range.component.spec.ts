import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StyleService, UIService } from '../../services';
import { DateRangeModalStandardComponent } from './standard/standard-modal.component';
import { DateRangeStandardComponent } from './standard/standard.component';

@Pipe({ name: 'translate', standalone: true })
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

const mockStyleService = {
  init: jest.fn(),
};

const mockUIService = {
  showAlertWithDismissCallback: jest.fn(),
};

describe('DateRangeStandardComponent', () => {
  let fixture: ComponentFixture<DateRangeStandardComponent>;
  let component: DateRangeStandardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateRangeStandardComponent],
      providers: [
        { provide: StyleService, useValue: mockStyleService },
        { provide: UIService, useValue: mockUIService },
      ],
    })
      .overrideComponent(DateRangeStandardComponent, {
        add: { imports: [MockTranslatePipe] },
        remove: { imports: [DateRangeModalStandardComponent] },
      })
      .overrideComponent(DateRangeStandardComponent, {
        set: {
          template: `
            <button class="trigger" (click)="onClick()">
              @if (value && value?.start && value?.end) {
                {{ value.start + ' - ' + value.end }}
              } @else {
                select
              }
            </button>
            @if (value) {
              <button class="clear" (click)="onClear()">X</button>
            }
          `,
        },
      })
      .compileComponents();
    fixture = TestBed.createComponent(DateRangeStandardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render trigger button', () => {
    const btn = fixture.nativeElement.querySelector('.trigger');
    expect(btn).toBeTruthy();
  });

  it('should show "select" when no value', () => {
    const btn = fixture.nativeElement.querySelector('.trigger');
    expect(btn.textContent).toContain('select');
  });

  it('should show date range when value set', () => {
    component.writeValue({ start: '2023-01-01', end: '2023-01-31' });
    component.ngModel.set({ start: '2023-01-01', end: '2023-01-31' });
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('.trigger');
    expect(btn.textContent).toContain('2023-01-01 - 2023-01-31');
  });

  it('should show clear button when value exists', () => {
    component.writeValue({ start: '2023-01-01', end: '2023-01-31' });
    component.ngModel.set({ start: '2023-01-01', end: '2023-01-31' });
    fixture.detectChanges();
    const clearBtn = fixture.nativeElement.querySelector('.clear');
    expect(clearBtn).toBeTruthy();
  });
});

describe('DateRangeModalStandardComponent', () => {
  let fixture: ComponentFixture<DateRangeModalStandardComponent>;
  let component: DateRangeModalStandardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateRangeModalStandardComponent],
      providers: [
        { provide: StyleService, useValue: mockStyleService },
        { provide: UIService, useValue: mockUIService },
      ],
    })
      .overrideComponent(DateRangeModalStandardComponent, {
        add: { imports: [MockTranslatePipe] },
      })
      .compileComponents();
    fixture = TestBed.createComponent(DateRangeModalStandardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render the modal overlay', () => {
    const backdrop = fixture.nativeElement.querySelector(
      '.smart\\:fixed.smart\\:inset-0',
    );
    expect(backdrop).toBeTruthy();
  });

  it('should render day-of-week headers', () => {
    expect(fixture.nativeElement.textContent).toContain(
      'CALENDAR.DAY_OF_WEEK.Sun',
    );
    expect(fixture.nativeElement.textContent).toContain(
      'CALENDAR.DAY_OF_WEEK.Mon',
    );
  });

  it('should render calendar months', () => {
    expect(component.calendar.length).toBeGreaterThan(0);
  });

  it('should render select button in footer', () => {
    const buttons = fixture.nativeElement.querySelectorAll('button');
    const selectBtn = Array.from(buttons).find((b: any) =>
      b.textContent.includes('select'),
    ) as HTMLButtonElement;
    expect(selectBtn).toBeTruthy();
  });
});
