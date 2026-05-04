import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalNavigationStandardComponent } from './standard.component';
import { IVerticalNavItemClick } from '../base/base.component';

describe('@smartsoft001/shared-angular: VerticalNavigationStandardComponent', () => {
  let fixture: ComponentFixture<VerticalNavigationStandardComponent>;
  let component: VerticalNavigationStandardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerticalNavigationStandardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VerticalNavigationStandardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should always render <nav.vertical-navigation>', () => {
    const nav = fixture.nativeElement.querySelector('nav.vertical-navigation');

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

    const emitted: IVerticalNavItemClick[] = [];
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
      items: [{ id: 'w', label: 'Website', initial: 'W' }],
    });
    fixture.detectChanges();

    const init = fixture.nativeElement.querySelector('span.item-initial');

    expect(init.textContent.trim()).toBe('W');
  });

  it('should render multiple groups with titles', () => {
    fixture.componentRef.setInput('options', {
      groups: [
        {
          id: 'main',
          items: [{ id: 'a', label: 'A' }],
        },
        {
          id: 'projects',
          title: 'Projects',
          items: [{ id: 'p1', label: 'Project 1' }],
        },
      ],
    });
    fixture.detectChanges();

    const groupTitles = fixture.nativeElement.querySelectorAll('.group-title');
    const groups = fixture.nativeElement.querySelectorAll('li.group');

    expect(groups.length).toBe(2);
    expect(groupTitles.length).toBe(1);
    expect(groupTitles[0].textContent).toContain('Projects');
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
});
