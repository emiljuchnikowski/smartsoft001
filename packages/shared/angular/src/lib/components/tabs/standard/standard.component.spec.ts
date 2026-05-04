import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsStandardComponent } from './standard.component';
import { ITabChange } from '../base/base.component';

describe('@smartsoft001/shared-angular: TabsStandardComponent', () => {
  let fixture: ComponentFixture<TabsStandardComponent>;
  let component: TabsStandardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsStandardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TabsStandardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should always render <nav.tabs-desktop>', () => {
    const nav = fixture.nativeElement.querySelector('nav.tabs-desktop');

    expect(nav).toBeTruthy();
  });

  it('should render mobile <select> when items provided', () => {
    fixture.componentRef.setInput('options', {
      items: [
        { id: 'a', label: 'A' },
        { id: 'b', label: 'B' },
      ],
    });
    fixture.detectChanges();

    const select = fixture.nativeElement.querySelector('.tabs-mobile select');

    expect(select).toBeTruthy();
    expect(select.querySelectorAll('option').length).toBe(2);
  });

  it('should NOT render mobile select when showMobileSelect=false', () => {
    fixture.componentRef.setInput('options', {
      items: [{ id: 'a', label: 'A' }],
      showMobileSelect: false,
    });
    fixture.detectChanges();

    const select = fixture.nativeElement.querySelector('.tabs-mobile select');

    expect(select).toBeNull();
  });

  it('should render tab as anchor when href provided', () => {
    fixture.componentRef.setInput('options', {
      items: [{ id: 'a', label: 'Account', href: '/account' }],
    });
    fixture.detectChanges();

    const anchor: HTMLAnchorElement =
      fixture.nativeElement.querySelector('a.tab-link');

    expect(anchor).toBeTruthy();
    expect(anchor.getAttribute('href')).toBe('/account');
  });

  it('should render tab as button when no href', () => {
    fixture.componentRef.setInput('options', {
      items: [{ id: 'a', label: 'Tab A' }],
    });
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button.tab-button');

    expect(button).toBeTruthy();
    expect(button.textContent).toContain('Tab A');
  });

  it('should mark current tab with class and aria-current', () => {
    fixture.componentRef.setInput('options', {
      items: [
        { id: 'a', label: 'A' },
        { id: 'b', label: 'B' },
      ],
    });
    fixture.componentRef.setInput('selectedId', 'b');
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button.tab-button');

    expect(buttons[0].className).not.toContain('current');
    expect(buttons[1].className).toContain('current');
    expect(buttons[1].getAttribute('aria-current')).toBe('page');
  });

  it('should emit tabChange and update selectedId on button click', () => {
    fixture.componentRef.setInput('options', {
      items: [{ id: 'a', label: 'A' }],
    });
    fixture.detectChanges();

    const emitted: ITabChange[] = [];
    component.tabChange.subscribe((v) => emitted.push(v));

    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('button.tab-button');
    button.click();

    expect(emitted.length).toBe(1);
    expect(emitted[0]).toEqual({ tabId: 'a' });
    expect(component.selectedId()).toBe('a');
  });

  it('should render badge when item.badge provided', () => {
    fixture.componentRef.setInput('options', {
      items: [{ id: 'a', label: 'A', badge: 5 }],
    });
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('span.tab-badge');

    expect(badge.textContent.trim()).toBe('5');
  });

  it('should change selectedId via mobile <select>', () => {
    fixture.componentRef.setInput('options', {
      items: [
        { id: 'a', label: 'A' },
        { id: 'b', label: 'B' },
      ],
    });
    fixture.detectChanges();

    const emitted: ITabChange[] = [];
    component.tabChange.subscribe((v) => emitted.push(v));

    const select: HTMLSelectElement = fixture.nativeElement.querySelector(
      '.tabs-mobile select',
    );
    select.value = 'b';
    select.dispatchEvent(new Event('change'));

    expect(emitted.length).toBe(1);
    expect(emitted[0]).toEqual({ tabId: 'b' });
    expect(component.selectedId()).toBe('b');
  });

  it('should apply external cssClass on the wrapper', () => {
    fixture.componentRef.setInput('class', 'my-extra-class');
    fixture.detectChanges();

    const wrapper = fixture.nativeElement.firstElementChild as HTMLElement;

    expect(wrapper.className).toContain('my-extra-class');
  });
});
