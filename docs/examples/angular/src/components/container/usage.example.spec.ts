import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: ContainerUsageExampleComponent', () => {
  let fixture: ComponentFixture<ContainerUsageExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContainerUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ContainerUsageExampleComponent);
  });

  it('should apply the layout from the options', () => {
    // Act
    fixture.detectChanges();

    // Assert
    const wrapper: HTMLElement =
      fixture.nativeElement.querySelector('[data-mode]');
    expect(wrapper.getAttribute('data-mode')).toBe('constrained');
    expect(wrapper.getAttribute('data-padding')).toBe('mobile');
  });

  it('should render the page content inside the container', () => {
    // Act
    fixture.detectChanges();

    // Assert
    const wrapper: HTMLElement =
      fixture.nativeElement.querySelector('[data-mode]');
    expect(wrapper.querySelector('h1')?.textContent).toBe('Account settings');
    expect(wrapper.textContent).toContain(
      'Manage your profile, notifications and billing details.',
    );
  });
});
