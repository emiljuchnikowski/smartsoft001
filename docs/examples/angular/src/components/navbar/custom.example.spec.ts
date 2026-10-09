import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { NavbarComponent } from '@smartsoft001/angular';

import {
  CustomNavbarComponent,
  NavbarCustomExampleComponent,
} from './custom.example';

describe('docs-examples-angular: NavbarCustomExampleComponent', () => {
  let fixture: ComponentFixture<NavbarCustomExampleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarCustomExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarCustomExampleComponent);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should render the custom navbar through the wrapper instead of the standard one', () => {
    expect(
      element.querySelector('smart-navbar docs-custom-navbar'),
    ).toBeTruthy();
    expect(element.querySelector('smart-navbar-standard')).toBeNull();
  });

  it('should render one entry per item and mark the current one', () => {
    const items = element.querySelectorAll('.docs-navbar__item');

    expect(items).toHaveLength(4);
    expect(items[0].getAttribute('aria-current')).toBe('page');
    expect(items[1].getAttribute('aria-current')).toBeNull();
  });

  it('should emit itemClick from the custom navbar and through the wrapper', () => {
    // Arrange
    const navbar: CustomNavbarComponent = fixture.debugElement.query(
      By.directive(CustomNavbarComponent),
    ).componentInstance;
    const wrapper: NavbarComponent = fixture.debugElement.query(
      By.directive(NavbarComponent),
    ).componentInstance;
    const emitted: string[] = [];
    const forwarded: string[] = [];
    navbar.itemClick.subscribe(({ itemId }: { itemId: string }) =>
      emitted.push(itemId),
    );
    wrapper.itemClick.subscribe(({ itemId }: { itemId: string }) =>
      forwarded.push(itemId),
    );

    // Act
    element.querySelectorAll<HTMLElement>('.docs-navbar__item')[2].click();

    // Assert
    expect(emitted).toEqual(['work']);
    expect(forwarded).toEqual(['work']);
  });

  it('should reveal the mobile panel when the menu button is toggled', () => {
    expect(element.querySelector('.docs-navbar__mobile')).toBeNull();

    element.querySelector<HTMLButtonElement>('.docs-navbar__toggle')?.click();
    fixture.detectChanges();

    expect(element.querySelector('.docs-navbar__mobile')).toBeTruthy();
  });
});
