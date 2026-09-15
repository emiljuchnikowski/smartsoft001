import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import {
  CustomVerticalNavigationComponent,
  VerticalNavigationCustomExampleComponent,
} from './custom.example';

describe('docs-examples-angular: VerticalNavigationCustomExampleComponent', () => {
  let fixture: ComponentFixture<VerticalNavigationCustomExampleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerticalNavigationCustomExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VerticalNavigationCustomExampleComponent);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should render the custom navigation through the wrapper instead of the standard one', () => {
    expect(
      element.querySelector(
        'smart-vertical-navigation docs-custom-vertical-navigation',
      ),
    ).toBeTruthy();
    expect(
      element.querySelector('smart-vertical-navigation-standard'),
    ).toBeNull();
  });

  it('should render the loose items and the titled group the base normalizes', () => {
    const groups = element.querySelectorAll('.docs-vertical-nav__group');
    const current = element.querySelector('.docs-vertical-nav__item--current');

    expect(groups.length).toBe(2);
    expect(
      groups[1].querySelector('.docs-vertical-nav__group-title')?.textContent,
    ).toContain('Projects');
    expect(current?.textContent).toContain('Team');
    expect(current?.querySelector('a')?.getAttribute('aria-current')).toBe(
      'page',
    );
  });

  // NgComponentOutlet forwards inputs but not outputs, so the wrapper's
  // (itemClick) never fires; the custom instance emits it.
  it('should emit itemClick from the custom instance for an item without a href', () => {
    const nav: CustomVerticalNavigationComponent = fixture.debugElement.query(
      By.directive(CustomVerticalNavigationComponent),
    ).componentInstance;
    const emitted: string[] = [];
    nav.itemClick.subscribe((event) => emitted.push(event.itemId));

    const button = element.querySelector<HTMLButtonElement>(
      '.docs-vertical-nav__item button',
    ) as HTMLButtonElement;
    button.click();

    expect(emitted).toEqual(['new-project']);
  });
});
