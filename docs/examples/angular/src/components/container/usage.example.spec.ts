import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: ContainerUsageExampleComponent', () => {
  let fixture: ComponentFixture<ContainerUsageExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContainerUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ContainerUsageExampleComponent);
    fixture.detectChanges();
  });

  it('should apply the layout from the options', () => {
    const wrapper: HTMLElement =
      fixture.nativeElement.querySelector('[data-mode]');

    expect(wrapper.getAttribute('data-mode')).toBe('constrained');
    expect(wrapper.getAttribute('data-padding')).toBe('mobile');
  });

  it('should project the page content', () => {
    const wrapper: HTMLElement =
      fixture.nativeElement.querySelector('[data-mode]');

    expect(wrapper.textContent).toContain('Account settings');
  });
});
