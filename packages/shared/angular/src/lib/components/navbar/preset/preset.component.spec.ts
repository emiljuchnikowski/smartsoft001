import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarPresetComponent } from './preset.component';

describe('@smartsoft001/shared-angular: NavbarPresetComponent', () => {
  let fixture: ComponentFixture<NavbarPresetComponent>;
  let component: NavbarPresetComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarPresetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarPresetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function header(): HTMLElement {
    return fixture.nativeElement.querySelector('header');
  }

  function collapse(): HTMLElement {
    return fixture.nativeElement.querySelector('#smart-navbar-collapse');
  }

  it('should create an instance', () => {
    expect(component).toBeInstanceOf(NavbarPresetComponent);
  });

  it('should render anchor items with their label and href', () => {
    fixture.componentRef.setInput('options', {
      items: [{ id: 'home', label: 'Home', href: '/home' }],
    });
    fixture.detectChanges();

    const link = collapse().querySelector('a');

    expect(link?.getAttribute('href')).toBe('/home');
    expect(link?.textContent?.trim()).toContain('Home');
  });

  it('should mark the current item as active', () => {
    fixture.componentRef.setInput('options', {
      items: [{ id: 'home', label: 'Home', href: '/home', current: true }],
    });
    fixture.detectChanges();

    const link = collapse().querySelector('a');

    expect(link?.className).toContain('smart:text-blue-600');
    expect(link?.className).toContain('smart:font-medium');
    expect(link?.getAttribute('aria-current')).toBe('page');
  });

  it('should render a button for items without an href and emit itemClick', () => {
    fixture.componentRef.setInput('options', {
      items: [{ id: 'action', label: 'Action' }],
    });
    fixture.detectChanges();

    let emitted: { itemId: string } | undefined;
    component.itemClick.subscribe((e) => (emitted = e));

    // The mobile toggle lives in the brand row; the only button inside the
    // collapse area is the nav item itself.
    collapse().querySelector<HTMLButtonElement>('button')?.click();

    expect(emitted).toEqual({ itemId: 'action' });
  });

  it('should hide the collapse area by default and reveal it when toggled', () => {
    expect(collapse().className).toContain('smart:hidden');

    const toggle = header().querySelector<HTMLButtonElement>(
      'button[aria-label="Toggle navigation"]',
    );
    toggle?.click();
    fixture.detectChanges();

    expect(component.mobileMenuOpen()).toBe(true);
    expect(collapse().className).not.toContain('smart:hidden');
  });

  it('should render an image logo wrapped in an anchor when logoHref is provided', () => {
    fixture.componentRef.setInput('options', {
      logoUrl: '/logo.png',
      logoAlt: 'Acme',
      logoHref: '/',
    });
    fixture.detectChanges();

    const brand = header().querySelector('a[aria-label="Brand"]');
    const img = brand?.querySelector('img');

    expect(brand?.getAttribute('href')).toBe('/');
    expect(img?.getAttribute('src')).toBe('/logo.png');
    expect(img?.getAttribute('alt')).toBe('Acme');
  });

  it('should apply the dark color variant to the header and nav items', () => {
    fixture.componentRef.setInput('options', {
      dark: true,
      items: [{ id: 'home', label: 'Home', href: '/home' }],
    });
    fixture.detectChanges();

    expect(header().className).toContain('smart:bg-gray-900');
    expect(collapse().querySelector('a')?.className).toContain(
      'smart:text-white/70',
    );
  });

  it('should render a secondary navigation row when secondaryItems is provided', () => {
    fixture.componentRef.setInput('options', {
      secondaryItems: [{ id: 'docs', label: 'Docs', href: '/docs' }],
    });
    fixture.detectChanges();

    const secondary = header().querySelector('nav[aria-label="Secondary"]');

    expect(secondary).toBeTruthy();
    expect(secondary?.querySelector('a')?.textContent?.trim()).toContain(
      'Docs',
    );
  });

  it('should apply cssClass on the host header (canonical name for NgComponentOutlet)', () => {
    fixture.componentRef.setInput('cssClass', 'my-extra-class');
    fixture.detectChanges();

    expect(header().className).toContain('my-extra-class');
  });
});
