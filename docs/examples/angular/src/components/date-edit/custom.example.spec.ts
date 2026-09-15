import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateEditCustomExampleComponent } from './custom.example';

describe('docs-examples-angular: DateEditCustomExampleComponent', () => {
  let fixture: ComponentFixture<DateEditCustomExampleComponent>;
  let component: DateEditCustomExampleComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateEditCustomExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DateEditCustomExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render the custom editor built on the base class', () => {
    const host = fixture.nativeElement.querySelector('docs-custom-date-edit');

    expect(host).toBeTruthy();
    expect(host.querySelector('.docs-date-edit__input')).toBeTruthy();
  });

  it('should seed the editor with the value bound by the host', () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector(
      '.docs-date-edit__input',
    );

    expect(input.value).toBe('2026-04-07');
  });

  it('should push a picked date back to the host through ngModel', () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector(
      '.docs-date-edit__input',
    );

    input.value = '2026-05-01';
    input.dispatchEvent(new Event('change'));

    expect(component.date()).toBe('2026-05-01');
  });
});
