import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import {
  BadgeCustomExampleComponent,
  CustomBadgeComponent,
} from './custom.example';

describe('docs-examples-angular: BadgeCustomExampleComponent', () => {
  let fixture: ComponentFixture<BadgeCustomExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadgeCustomExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BadgeCustomExampleComponent);
    fixture.detectChanges();
  });

  it('should render the custom badge instead of the standard one', () => {
    const badge = fixture.nativeElement.querySelector('.docs-badge');

    expect(badge).not.toBeNull();
    expect(badge.textContent).toContain('In review');
    expect(badge.getAttribute('data-color')).toBe('yellow');
    expect(
      fixture.nativeElement.querySelector('smart-badge-standard'),
    ).toBeNull();
  });

  it('should emit removed when the custom remove button is clicked', () => {
    const badge: CustomBadgeComponent = fixture.debugElement.query(
      By.directive(CustomBadgeComponent),
    ).componentInstance;
    let removals = 0;
    badge.removed.subscribe(() => (removals += 1));

    const remove: HTMLButtonElement = fixture.nativeElement.querySelector(
      '.docs-badge__remove',
    );
    remove.click();

    expect(removals).toBe(1);
  });
});
