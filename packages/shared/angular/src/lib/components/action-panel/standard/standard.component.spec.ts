import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPanelStandardComponent } from './standard.component';
import { IActionPanelActionClick } from '../base/base.component';

describe('@smartsoft001/shared-angular: ActionPanelStandardComponent', () => {
  let fixture: ComponentFixture<ActionPanelStandardComponent>;
  let component: ActionPanelStandardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionPanelStandardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ActionPanelStandardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should always render <section.action-panel>', () => {
    const section = fixture.nativeElement.querySelector('section.action-panel');

    expect(section).toBeTruthy();
  });

  it('should render title when options.title is provided', () => {
    fixture.componentRef.setInput('options', { title: 'Manage subscription' });
    fixture.detectChanges();

    const h3 = fixture.nativeElement.querySelector('h3');

    expect(h3.textContent).toContain('Manage subscription');
  });

  it('should NOT render <h3> when options.title is missing', () => {
    fixture.componentRef.setInput('options', {});
    fixture.detectChanges();

    const h3 = fixture.nativeElement.querySelector('h3');

    expect(h3).toBeNull();
  });

  it('should render description text when options.description is provided', () => {
    fixture.componentRef.setInput('options', {
      description: 'Lorem ipsum.',
    });
    fixture.detectChanges();

    const p = fixture.nativeElement.querySelector('p.description');

    expect(p.textContent).toContain('Lorem ipsum.');
  });

  it('should render action buttons when options.actions provided', () => {
    fixture.componentRef.setInput('options', {
      actions: [
        { id: 'change', label: 'Change plan', variant: 'primary' },
        { id: 'cancel', label: 'Cancel', variant: 'ghost' },
      ],
    });
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button.action');

    expect(buttons.length).toBe(2);
    expect(buttons[0].className).toContain('variant-primary');
    expect(buttons[0].textContent).toContain('Change plan');
    expect(buttons[1].className).toContain('variant-ghost');
  });

  it('should render anchor when action.href is provided', () => {
    fixture.componentRef.setInput('options', {
      actions: [
        { id: 'learn', label: 'Learn more', href: '/learn', variant: 'link' },
      ],
    });
    fixture.detectChanges();

    const anchor: HTMLAnchorElement =
      fixture.nativeElement.querySelector('a.action');

    expect(anchor).toBeTruthy();
    expect(anchor.getAttribute('href')).toBe('/learn');
    expect(anchor.className).toContain('variant-link');
    expect(anchor.textContent).toContain('Learn more');
  });

  it('should emit actionClick with action id on button click', () => {
    fixture.componentRef.setInput('options', {
      actions: [{ id: 'submit', label: 'Submit' }],
    });
    fixture.detectChanges();

    const emitted: IActionPanelActionClick[] = [];
    component.actionClick.subscribe((v) => emitted.push(v));

    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('button.action');
    button.click();

    expect(emitted.length).toBe(1);
    expect(emitted[0]).toEqual({ actionId: 'submit' });
  });

  it('should default action variant to primary for buttons', () => {
    fixture.componentRef.setInput('options', {
      actions: [{ id: 'submit', label: 'Submit' }],
    });
    fixture.detectChanges();

    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('button.action');

    expect(button.className).toContain('variant-primary');
  });

  it('should apply external cssClass on the wrapper', () => {
    fixture.componentRef.setInput('class', 'my-extra-class');
    fixture.detectChanges();

    const wrapper = fixture.nativeElement.firstElementChild as HTMLElement;

    expect(wrapper.className).toContain('my-extra-class');
  });
});
