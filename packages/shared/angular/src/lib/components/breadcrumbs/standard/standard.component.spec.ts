import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreadcrumbsStandardComponent } from './standard.component';
import { IBreadcrumbsItemClick } from '../base/base.component';

describe('@smartsoft001/shared-angular: BreadcrumbsStandardComponent', () => {
  let fixture: ComponentFixture<BreadcrumbsStandardComponent>;
  let component: BreadcrumbsStandardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreadcrumbsStandardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BreadcrumbsStandardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should always render <nav.breadcrumbs>', () => {
    const nav = fixture.nativeElement.querySelector('nav.breadcrumbs');

    expect(nav).toBeTruthy();
  });

  it('should set default aria-label "Breadcrumb"', () => {
    const nav = fixture.nativeElement.querySelector('nav.breadcrumbs');

    expect(nav.getAttribute('aria-label')).toBe('Breadcrumb');
  });

  it('should set custom aria-label from options', () => {
    fixture.componentRef.setInput('options', {
      items: [],
      ariaLabel: 'Custom',
    });
    fixture.detectChanges();

    const nav = fixture.nativeElement.querySelector('nav.breadcrumbs');

    expect(nav.getAttribute('aria-label')).toBe('Custom');
  });

  it('should render anchor item with href', () => {
    fixture.componentRef.setInput('options', {
      items: [{ id: 'home', label: 'Home', href: '/' }],
    });
    fixture.detectChanges();

    const anchor: HTMLAnchorElement =
      fixture.nativeElement.querySelector('a.breadcrumbs-link');

    expect(anchor).toBeTruthy();
    expect(anchor.getAttribute('href')).toBe('/');
    expect(anchor.textContent).toContain('Home');
  });

  it('should render button when no href', () => {
    fixture.componentRef.setInput('options', {
      items: [{ id: 'a', label: 'Item A' }],
    });
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector(
      'button.breadcrumbs-button',
    );

    expect(button).toBeTruthy();
    expect(button.textContent).toContain('Item A');
  });

  it('should emit itemClick when button-type item is clicked', () => {
    fixture.componentRef.setInput('options', {
      items: [{ id: 'projects', label: 'Projects' }],
    });
    fixture.detectChanges();

    const emitted: IBreadcrumbsItemClick[] = [];
    component.itemClick.subscribe((v) => emitted.push(v));

    const button: HTMLButtonElement = fixture.nativeElement.querySelector(
      'button.breadcrumbs-button',
    );
    button.click();

    expect(emitted.length).toBe(1);
    expect(emitted[0]).toEqual({ itemId: 'projects' });
  });

  it('should mark current item with aria-current="page" and current class', () => {
    fixture.componentRef.setInput('options', {
      items: [
        { id: 'home', label: 'Home', href: '/' },
        { id: 'p', label: 'Project', href: '/p', current: true },
      ],
    });
    fixture.detectChanges();

    const links: NodeListOf<HTMLAnchorElement> =
      fixture.nativeElement.querySelectorAll('a.breadcrumbs-link');

    expect(links.length).toBe(2);
    expect(links[1].getAttribute('aria-current')).toBe('page');
    expect(links[1].className).toContain('current');
    expect(links[0].getAttribute('aria-current')).toBeNull();
  });

  it('should render separator between items but not before first', () => {
    fixture.componentRef.setInput('options', {
      items: [
        { id: 'home', label: 'Home', href: '/' },
        { id: 'p', label: 'Projects', href: '/p' },
        { id: 'n', label: 'Nero', href: '/p/n' },
      ],
    });
    fixture.detectChanges();

    const separators = fixture.nativeElement.querySelectorAll(
      '.breadcrumbs-separator',
    );

    expect(separators.length).toBe(2);
  });

  it('should set data-separator attribute from options.separator', () => {
    fixture.componentRef.setInput('options', {
      separator: 'slash',
      items: [
        { id: 'a', label: 'A', href: '/a' },
        { id: 'b', label: 'B', href: '/b' },
      ],
    });
    fixture.detectChanges();

    const separator = fixture.nativeElement.querySelector(
      '.breadcrumbs-separator',
    );

    expect(separator.getAttribute('data-separator')).toBe('slash');
  });

  it('should default data-separator to chevron when not provided', () => {
    fixture.componentRef.setInput('options', {
      items: [
        { id: 'a', label: 'A', href: '/a' },
        { id: 'b', label: 'B', href: '/b' },
      ],
    });
    fixture.detectChanges();

    const separator = fixture.nativeElement.querySelector(
      '.breadcrumbs-separator',
    );

    expect(separator.getAttribute('data-separator')).toBe('chevron');
  });

  it('should render sr-only label when item.srOnlyLabel provided', () => {
    fixture.componentRef.setInput('options', {
      items: [{ id: 'home', href: '/', srOnlyLabel: 'Home' }],
    });
    fixture.detectChanges();

    const sr = fixture.nativeElement.querySelector('.sr-only');

    expect(sr.textContent).toContain('Home');
  });

  it('should apply external cssClass on the wrapper', () => {
    fixture.componentRef.setInput('class', 'extra');
    fixture.detectChanges();

    const wrapper = fixture.nativeElement.firstElementChild as HTMLElement;

    expect(wrapper.className).toContain('extra');
  });
});
