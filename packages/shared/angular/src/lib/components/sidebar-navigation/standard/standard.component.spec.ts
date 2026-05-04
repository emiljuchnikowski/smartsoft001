import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarNavigationStandardComponent } from './standard.component';
import {
  ISidebarNavItemClick,
  ISidebarNavItemToggle,
} from '../base/base.component';

describe('@smartsoft001/shared-angular: SidebarNavigationStandardComponent', () => {
  let fixture: ComponentFixture<SidebarNavigationStandardComponent>;
  let component: SidebarNavigationStandardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarNavigationStandardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarNavigationStandardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should always render <nav.sidebar-navigation>', () => {
    const nav = fixture.nativeElement.querySelector('nav.sidebar-navigation');

    expect(nav).toBeTruthy();
  });

  it('should render anchor when item.href provided', () => {
    fixture.componentRef.setInput('options', {
      items: [{ id: 'dash', label: 'Dashboard', href: '/dash', current: true }],
    });
    fixture.detectChanges();

    const anchor: HTMLAnchorElement =
      fixture.nativeElement.querySelector('a.item-link');

    expect(anchor).toBeTruthy();
    expect(anchor.getAttribute('href')).toBe('/dash');
    expect(anchor.className).toContain('current');
    expect(anchor.getAttribute('aria-current')).toBe('page');
    expect(anchor.textContent).toContain('Dashboard');
  });

  it('should render button when no href', () => {
    fixture.componentRef.setInput('options', {
      items: [{ id: 'a', label: 'Item A' }],
    });
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button.item-button');

    expect(button).toBeTruthy();
    expect(button.textContent).toContain('Item A');
  });

  it('should emit itemClick on button click', () => {
    fixture.componentRef.setInput('options', {
      items: [{ id: 'team', label: 'Team' }],
    });
    fixture.detectChanges();

    const emitted: ISidebarNavItemClick[] = [];
    component.itemClick.subscribe((v) => emitted.push(v));

    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('button.item-button');
    button.click();

    expect(emitted.length).toBe(1);
    expect(emitted[0]).toEqual({ itemId: 'team' });
  });

  it('should render badge when item.badge provided', () => {
    fixture.componentRef.setInput('options', {
      items: [{ id: 'a', label: 'A', badge: 12 }],
    });
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('span.item-badge');

    expect(badge.textContent.trim()).toBe('12');
  });

  it('should render initial when item.initial provided', () => {
    fixture.componentRef.setInput('options', {
      items: [{ id: 'h', label: 'Heroicons', initial: 'H' }],
    });
    fixture.detectChanges();

    const init = fixture.nativeElement.querySelector('span.item-initial');

    expect(init.textContent.trim()).toBe('H');
  });

  it('should render multiple groups with titles', () => {
    fixture.componentRef.setInput('options', {
      groups: [
        {
          id: 'main',
          items: [{ id: 'a', label: 'A' }],
        },
        {
          id: 'teams',
          title: 'Your teams',
          items: [{ id: 'h', label: 'Heroicons', initial: 'H' }],
        },
      ],
    });
    fixture.detectChanges();

    const groupTitles = fixture.nativeElement.querySelectorAll('.group-title');
    const groups = fixture.nativeElement.querySelectorAll('li.group');

    expect(groups.length).toBe(2);
    expect(groupTitles.length).toBe(1);
    expect(groupTitles[0].textContent).toContain('Your teams');
  });

  it('should combine items + groups when both provided', () => {
    fixture.componentRef.setInput('options', {
      items: [{ id: 'home', label: 'Home' }],
      groups: [{ title: 'Other', items: [{ id: 'x', label: 'X' }] }],
    });
    fixture.detectChanges();

    const groups = fixture.nativeElement.querySelectorAll('li.group');

    expect(groups.length).toBe(2);
  });

  it('should apply external cssClass on the wrapper', () => {
    fixture.componentRef.setInput('class', 'my-extra-class');
    fixture.detectChanges();

    const wrapper = fixture.nativeElement.firstElementChild as HTMLElement;

    expect(wrapper.className).toContain('my-extra-class');
  });

  it('should set aria-label from options.ariaLabel', () => {
    fixture.componentRef.setInput('options', { ariaLabel: 'Main' });
    fixture.detectChanges();

    const nav = fixture.nativeElement.querySelector('nav');

    expect(nav.getAttribute('aria-label')).toBe('Main');
  });

  it('should render logo image when logo.url provided', () => {
    fixture.componentRef.setInput('options', {
      logo: { url: '/logo.svg', alt: 'Logo' },
    });
    fixture.detectChanges();

    const img: HTMLImageElement =
      fixture.nativeElement.querySelector('.sidebar-logo img');

    expect(img).toBeTruthy();
    expect(img.getAttribute('src')).toBe('/logo.svg');
    expect(img.getAttribute('alt')).toBe('Logo');
  });

  it('should render profile footer when profile provided', () => {
    fixture.componentRef.setInput('options', {
      profile: {
        name: 'Tom Cook',
        avatarUrl: '/avatar.jpg',
        href: '/me',
      },
    });
    fixture.detectChanges();

    const profileLink: HTMLAnchorElement =
      fixture.nativeElement.querySelector('a.profile-link');
    const name = fixture.nativeElement.querySelector('.profile-name');
    const avatar: HTMLImageElement =
      fixture.nativeElement.querySelector('.profile-avatar');

    expect(profileLink).toBeTruthy();
    expect(profileLink.getAttribute('href')).toBe('/me');
    expect(name.textContent).toContain('Tom Cook');
    expect(avatar.getAttribute('src')).toBe('/avatar.jpg');
  });

  it('should render expandable item with children when toggled', () => {
    fixture.componentRef.setInput('options', {
      items: [
        {
          id: 'teams',
          label: 'Teams',
          expandable: true,
          children: [{ id: 'eng', label: 'Engineering', href: '/eng' }],
        },
      ],
    });
    fixture.detectChanges();

    const toggleBtn: HTMLButtonElement =
      fixture.nativeElement.querySelector('button.item-toggle');

    expect(toggleBtn).toBeTruthy();
    expect(toggleBtn.getAttribute('aria-expanded')).toBe('false');

    let children = fixture.nativeElement.querySelector('ul.children');
    expect(children).toBeNull();

    const emitted: ISidebarNavItemToggle[] = [];
    component.itemToggle.subscribe((v) => emitted.push(v));
    toggleBtn.click();
    fixture.detectChanges();

    expect(emitted.length).toBe(1);
    expect(emitted[0]).toEqual({ itemId: 'teams', expanded: true });

    children = fixture.nativeElement.querySelector('ul.children');
    expect(children).toBeTruthy();

    const childAnchor: HTMLAnchorElement =
      fixture.nativeElement.querySelector('a.child-link');
    expect(childAnchor.getAttribute('href')).toBe('/eng');
    expect(childAnchor.textContent).toContain('Engineering');
  });

  it('should respect initial expanded=true on expandable item', () => {
    fixture.componentRef.setInput('options', {
      items: [
        {
          id: 'projects',
          label: 'Projects',
          expandable: true,
          expanded: true,
          children: [{ id: 'a', label: 'A', href: '/a' }],
        },
      ],
    });
    fixture.detectChanges();

    const toggleBtn = fixture.nativeElement.querySelector('button.item-toggle');
    const children = fixture.nativeElement.querySelector('ul.children');

    expect(toggleBtn.getAttribute('aria-expanded')).toBe('true');
    expect(children).toBeTruthy();
  });
});
