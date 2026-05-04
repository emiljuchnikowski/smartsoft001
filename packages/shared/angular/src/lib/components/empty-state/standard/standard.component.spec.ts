import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyStateStandardComponent } from './standard.component';
import {
  IEmptyStateActionClick,
  IEmptyStateItemClick,
} from '../base/base.component';

describe('@smartsoft001/shared-angular: EmptyStateStandardComponent', () => {
  let fixture: ComponentFixture<EmptyStateStandardComponent>;
  let component: EmptyStateStandardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyStateStandardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyStateStandardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should always render the wrapper', () => {
    const wrapper = fixture.nativeElement.querySelector('.empty-state');

    expect(wrapper).toBeTruthy();
  });

  it('should render title when options.title is provided', () => {
    fixture.componentRef.setInput('options', { title: 'No projects' });
    fixture.detectChanges();

    const h3 = fixture.nativeElement.querySelector('h3.title');

    expect(h3.textContent).toContain('No projects');
  });

  it('should render description text when options.description is provided', () => {
    fixture.componentRef.setInput('options', {
      description: 'Get started by creating a new project.',
    });
    fixture.detectChanges();

    const p = fixture.nativeElement.querySelector('p.description');

    expect(p.textContent).toContain('Get started by creating a new project.');
  });

  it('should render action buttons when options.actions provided', () => {
    fixture.componentRef.setInput('options', {
      actions: [{ id: 'create', label: 'New Project', variant: 'primary' }],
    });
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button.action');

    expect(button).toBeTruthy();
    expect(button.className).toContain('variant-primary');
    expect(button.textContent).toContain('New Project');
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
    expect(anchor.textContent).toContain('Learn more');
  });

  it('should emit actionClick on button click', () => {
    fixture.componentRef.setInput('options', {
      actions: [{ id: 'create', label: 'Create' }],
    });
    fixture.detectChanges();

    const emitted: IEmptyStateActionClick[] = [];
    component.actionClick.subscribe((v) => emitted.push(v));

    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('button.action');
    button.click();

    expect(emitted.length).toBe(1);
    expect(emitted[0]).toEqual({ actionId: 'create' });
  });

  it('should render items list when options.items provided', () => {
    fixture.componentRef.setInput('options', {
      items: [
        { id: 'list', title: 'Create a List', description: 'A list...' },
        {
          id: 'calendar',
          title: 'Create a Calendar',
          description: 'Stay on top...',
        },
      ],
    });
    fixture.detectChanges();

    const items = fixture.nativeElement.querySelectorAll('li.item');

    expect(items.length).toBe(2);
    expect(items[0].textContent).toContain('Create a List');
    expect(items[1].textContent).toContain('Create a Calendar');
  });

  it('should emit itemClick when item without href is clicked', () => {
    fixture.componentRef.setInput('options', {
      items: [{ id: 'list', title: 'Create a List' }],
    });
    fixture.detectChanges();

    const emitted: IEmptyStateItemClick[] = [];
    component.itemClick.subscribe((v) => emitted.push(v));

    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('button.item-button');
    button.click();

    expect(emitted.length).toBe(1);
    expect(emitted[0]).toEqual({ itemId: 'list' });
  });

  it('should render anchor when item.href is provided', () => {
    fixture.componentRef.setInput('options', {
      items: [{ id: 'list', title: 'Create a List', href: '/lists/new' }],
    });
    fixture.detectChanges();

    const anchor: HTMLAnchorElement =
      fixture.nativeElement.querySelector('a.item-link');

    expect(anchor).toBeTruthy();
    expect(anchor.getAttribute('href')).toBe('/lists/new');
  });

  it('should render itemsTitle when provided', () => {
    fixture.componentRef.setInput('options', {
      itemsTitle: 'Recommended templates',
      items: [{ id: 'a', title: 'A' }],
    });
    fixture.detectChanges();

    const h4 = fixture.nativeElement.querySelector('h4.items-title');

    expect(h4.textContent).toContain('Recommended templates');
  });

  it('should render footer link with href when both provided', () => {
    fixture.componentRef.setInput('options', {
      footerLinkLabel: 'Or start from an empty project',
      footerLinkHref: '/projects/new',
    });
    fixture.detectChanges();

    const link: HTMLAnchorElement =
      fixture.nativeElement.querySelector('a.footer-link');

    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toBe('/projects/new');
    expect(link.textContent).toContain('Or start from an empty project');
  });

  it('should render footer label as span when no href', () => {
    fixture.componentRef.setInput('options', {
      footerLinkLabel: 'Or start fresh',
    });
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('span.footer-link');

    expect(span).toBeTruthy();
    expect(span.textContent).toContain('Or start fresh');
  });

  it('should apply external cssClass on the wrapper', () => {
    fixture.componentRef.setInput('class', 'my-extra-class');
    fixture.detectChanges();

    const wrapper = fixture.nativeElement.firstElementChild as HTMLElement;

    expect(wrapper.className).toContain('my-extra-class');
  });
});
