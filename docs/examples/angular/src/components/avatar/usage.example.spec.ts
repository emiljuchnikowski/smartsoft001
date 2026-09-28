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

  it('should render the single avatar from its initials and size', () => {
    const avatar: HTMLElement =
      fixture.nativeElement.querySelector('[data-size="lg"]');

    expect(avatar.textContent).toContain('JD');
    expect(avatar.getAttribute('data-shape')).toBe('rounded');
  });

  it('should render one item per team member in the group', () => {
    const items = fixture.nativeElement.querySelectorAll(
      '.smart-avatar-group-item',
    );

    expect(items.length).toBe(3);
  });
});
