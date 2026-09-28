import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgeUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: BadgeUsageExampleComponent', () => {
  let fixture: ComponentFixture<BadgeUsageExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadgeUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BadgeUsageExampleComponent);
    fixture.detectChanges();
  });

  it('should render the badge text, color and dot from the inputs', () => {
    const badge: HTMLElement =
      fixture.nativeElement.querySelector('[data-color]');

    expect(badge.textContent).toContain('Active');
    expect(badge.getAttribute('data-color')).toBe('green');
    expect(badge.querySelector('.smart-badge-dot')).not.toBeNull();
  });

  it('should run the removed handler and hide the badge', () => {
    const remove: HTMLButtonElement = fixture.nativeElement.querySelector(
      'button[aria-label="Remove"]',
    );

    remove.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.visible()).toBe(false);
    expect(fixture.nativeElement.textContent).not.toContain('Active');
  });
});
