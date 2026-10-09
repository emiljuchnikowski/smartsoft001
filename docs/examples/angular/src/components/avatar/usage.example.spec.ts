import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: AvatarUsageExampleComponent', () => {
  let fixture: ComponentFixture<AvatarUsageExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AvatarUsageExampleComponent);
    fixture.detectChanges();
  });

  it('should render the single avatar from its initials, size and shape', () => {
    // Act
    const avatar: HTMLElement =
      fixture.nativeElement.querySelector('[data-size="lg"]');

    // Assert
    expect(avatar.textContent).toContain('JD');
    expect(avatar.getAttribute('data-shape')).toBe('rounded');
  });

  it('should render one item per team member in the group', () => {
    // Act
    const items = fixture.nativeElement.querySelectorAll(
      '.smart-avatar-group-item',
    );

    // Assert
    expect(items.length).toBe(3);
  });

  it('should pass the stack direction to the group container', () => {
    // Act
    const group: HTMLElement =
      fixture.nativeElement.querySelector('[data-size="sm"]');

    // Assert
    expect(group.getAttribute('data-stack-direction')).toBe('bottom-to-top');
  });
});
