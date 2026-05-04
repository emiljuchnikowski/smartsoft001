import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarStandardComponent } from './standard.component';
import { INavbarItemClick } from '../base/base.component';

describe('@smartsoft001/shared-angular: NavbarStandardComponent', () => {
  let fixture: ComponentFixture<NavbarStandardComponent>;
  let component: NavbarStandardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarStandardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarStandardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should always render <nav.navbar>', () => {
    const nav = fixture.nativeElement.querySelector('nav.navbar');

    expect(nav).toBeTruthy();
  });

  it('should always render the mobile menu toggle button', () => {
    const btn = fixture.nativeElement.querySelector(
      'button.mobile-menu-toggle',
    );

    expect(btn).toBeTruthy();
  });

  it('should render logo image when options.logoUrl is provided', () => {
    fixture.componentRef.setInput('options', {
      logoUrl: '/logo.svg',
      logoAlt: 'Acme',
    });
    fixture.detectChanges();

    const img: HTMLImageElement =
      fixture.nativeElement.querySelector('.logo img');

    expect(img).toBeTruthy();
    expect(img.getAttribute('src')).toBe('/logo.svg');
    expect(img.getAttribute('alt')).toBe('Acme');
  });

  it('should render logo as anchor when logoHref is provided', () => {
    fixture.componentRef.setInput('options', {
      logoUrl: '/logo.svg',
      logoHref: '/',
    });
    fixture.detectChanges();

    const anchor: HTMLAnchorElement =
      fixture.nativeElement.querySelector('a.logo');

    expect(anchor).toBeTruthy();
    expect(anchor.getAttribute('href')).toBe('/');
  });

  it('should render menu items as anchors when href provided', () => {
    fixture.componentRef.setInput('options', {
      items: [
        { id: 'home', label: 'Home', href: '/', current: true },
        { id: 'team', label: 'Team', href: '/team' },
      ],
    });
    fixture.detectChanges();

    const anchors = fixture.nativeElement.querySelectorAll('a.item-link');

    expect(anchors.length).toBe(2);
    expect(anchors[0].className).toContain('current');
    expect(anchors[0].textContent).toContain('Home');
    expect(anchors[1].className).not.toContain('current');
  });

  it('should render menu items as buttons when no href', () => {
    fixture.componentRef.setInput('options', {
      items: [{ id: 'menu', label: 'Menu' }],
    });
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button.item-button');

    expect(button).toBeTruthy();
    expect(button.textContent).toContain('Menu');
  });

  it('should emit itemClick when item button is clicked', () => {
    fixture.componentRef.setInput('options', {
      items: [{ id: 'menu', label: 'Menu' }],
    });
    fixture.detectChanges();

    const emitted: INavbarItemClick[] = [];
    component.itemClick.subscribe((v) => emitted.push(v));

    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('button.item-button');
    button.click();

    expect(emitted.length).toBe(1);
    expect(emitted[0]).toEqual({ itemId: 'menu' });
  });

  it('should toggle mobileMenuOpen when toggle button clicked', () => {
    expect(component.mobileMenuOpen()).toBe(false);

    const btn: HTMLButtonElement = fixture.nativeElement.querySelector(
      'button.mobile-menu-toggle',
    );
    btn.click();

    expect(component.mobileMenuOpen()).toBe(true);
  });

  it('should render mobile menu when mobileMenuOpen is true', () => {
    fixture.componentRef.setInput('options', {
      items: [{ id: 'home', label: 'Home', href: '/' }],
    });
    fixture.componentRef.setInput('mobileMenuOpen', true);
    fixture.detectChanges();

    const mobileMenu = fixture.nativeElement.querySelector('.mobile-menu');

    expect(mobileMenu).toBeTruthy();
    expect(mobileMenu.textContent).toContain('Home');
  });

  it('should NOT render mobile menu by default', () => {
    fixture.componentRef.setInput('options', {
      items: [{ id: 'home', label: 'Home' }],
    });
    fixture.detectChanges();

    const mobileMenu = fixture.nativeElement.querySelector('.mobile-menu');

    expect(mobileMenu).toBeNull();
  });

  it('should render secondary nav when secondaryItems provided', () => {
    fixture.componentRef.setInput('options', {
      secondaryItems: [{ id: 'docs', label: 'Docs', href: '/docs' }],
    });
    fixture.detectChanges();

    const secondary = fixture.nativeElement.querySelector(
      'nav.navbar-secondary',
    );

    expect(secondary).toBeTruthy();
    expect(secondary.textContent).toContain('Docs');
  });

  it('should apply external cssClass on the wrapper', () => {
    fixture.componentRef.setInput('class', 'my-extra-class');
    fixture.detectChanges();

    const wrapper = fixture.nativeElement.firstElementChild as HTMLElement;

    expect(wrapper.className).toContain('my-extra-class');
  });
});
