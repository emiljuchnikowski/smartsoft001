import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectMenuUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: SelectMenuUsageExampleComponent', () => {
  let fixture: ComponentFixture<SelectMenuUsageExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectMenuUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectMenuUsageExampleComponent);
    fixture.detectChanges();
  });

  it('should render the placeholder and the items from the options', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('Choose a plan');
    expect(element.textContent).toContain('Professional');
  });

  it('should write the chosen value into the bound signal', () => {
    const select: HTMLSelectElement =
      fixture.nativeElement.querySelector('select');

    select.value = 'pro';
    select.dispatchEvent(new Event('change'));

    expect(fixture.componentInstance.plan()).toBe('pro');
  });
});
