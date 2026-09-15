import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import {
  CustomSidebarNavigationComponent,
  SidebarNavigationCustomExampleComponent,
} from './custom.example';

describe('docs-examples-angular: SidebarNavigationCustomExampleComponent', () => {
  let fixture: ComponentFixture<SidebarNavigationCustomExampleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarNavigationCustomExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarNavigationCustomExampleComponent);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should render the custom navigation through the wrapper instead of the standard one', () => {
    expect(
      element.querySelector(
        'smart-sidebar-navigation docs-custom-sidebar-navigation',
      ),
    ).toBeTruthy();
    expect(
      element.querySelector('smart-sidebar-navigation-standard'),
    ).toBeNull();
  });

  it('should group the flat items and the named group the base class resolves', () => {
    const groups = element.querySelectorAll('.docs-sidebar-navigation__group');

    expect(groups).toHaveLength(2);
    expect(
      element.querySelector('.docs-sidebar-navigation__group-title')
        ?.textContent,
    ).toContain('Your teams');
    expect(
      element.querySelector('.docs-sidebar-navigation__profile')?.textContent,
    ).toContain('Tom Cook');
  });

  it('should expand a collapsed section through the base class', () => {
    expect(
      element.querySelector('.docs-sidebar-navigation__children'),
    ).toBeNull();

    element
      .querySelector<HTMLButtonElement>('.docs-sidebar-navigation__toggle')
      ?.click();
    fixture.detectChanges();

    expect(
      element.querySelectorAll('.docs-sidebar-navigation__children a'),
    ).toHaveLength(2);
  });

  // NgComponentOutlet does not forward outputs, so itemClick never reaches the
  // wrapper; it is asserted on the custom component instance instead.
  it('should emit itemClick from the custom component when a link is clicked', () => {
    const custom: CustomSidebarNavigationComponent = fixture.debugElement.query(
      By.directive(CustomSidebarNavigationComponent),
    ).componentInstance;
    const clicked: string[] = [];
    custom.itemClick.subscribe((event) => clicked.push(event.itemId));

    element
      .querySelectorAll<HTMLAnchorElement>('.docs-sidebar-navigation__link')[1]
      .click();

    expect(clicked).toEqual(['team']);
  });
});
