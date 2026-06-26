import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyStatePresetComponent } from './preset.component';

describe('@smartsoft001/shared-angular: EmptyStatePresetComponent', () => {
  let fixture: ComponentFixture<EmptyStatePresetComponent>;
  let component: EmptyStatePresetComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyStatePresetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyStatePresetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function root(): HTMLElement {
    return fixture.nativeElement.querySelector('div');
  }

  it('should create an instance', () => {
    expect(component).toBeInstanceOf(EmptyStatePresetComponent);
  });

  it('should render the title and description', () => {
    fixture.componentRef.setInput('options', {
      title: 'No draft invoices',
      description: 'Draft an invoice and send it to a customer.',
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h3')?.textContent?.trim()).toBe(
      'No draft invoices',
    );
    expect(fixture.nativeElement.querySelector('p')?.textContent?.trim()).toBe(
      'Draft an invoice and send it to a customer.',
    );
  });

  it('should apply the container preset classes on the root', () => {
    const cls = root().className;

    expect(cls).toContain('smart:max-w-sm');
    expect(cls).toContain('smart:flex-col');
  });

  it('should render a primary action button by default and emit actionClick', () => {
    fixture.componentRef.setInput('options', {
      actions: [{ id: 'create', label: 'Create a new invoice' }],
    });
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button.className).toContain('smart:bg-blue-600');

    let emitted: string | undefined;
    component.actionClick.subscribe((e) => (emitted = e.actionId));
    button.click();

    expect(emitted).toBe('create');
  });

  it('should apply secondary variant classes on the action button', () => {
    fixture.componentRef.setInput('options', {
      actions: [{ id: 'tpl', label: 'Use a Template', variant: 'secondary' }],
    });
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');

    expect(button.className).toContain('smart:bg-white');
    expect(button.className).toContain('smart:border-gray-200');
  });

  it('should render an anchor for actions with an href', () => {
    fixture.componentRef.setInput('options', {
      actions: [{ id: 'docs', label: 'Docs', href: '/docs' }],
    });
    fixture.detectChanges();

    const anchor = fixture.nativeElement.querySelector('a');

    expect(anchor).toBeTruthy();
    expect(anchor.getAttribute('href')).toBe('/docs');
  });

  it('should render the footer "Learn more" link from footerLink* options', () => {
    fixture.componentRef.setInput('options', {
      footerLinkLabel: 'Learn more',
      footerLinkHref: '#',
    });
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('a');

    expect(link?.textContent?.trim()).toContain('Learn more');
    expect(link?.className).toContain('smart:text-blue-600');
  });

  it('should render items and emit itemClick on a button item', () => {
    fixture.componentRef.setInput('options', {
      itemsTitle: 'Suggestions',
      items: [{ id: 'a', title: 'First' }],
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h4')?.textContent?.trim()).toBe(
      'Suggestions',
    );

    let emitted: string | undefined;
    component.itemClick.subscribe((e) => (emitted = e.itemId));
    fixture.nativeElement.querySelector('li button')?.click();

    expect(emitted).toBe('a');
  });

  it('should apply cssClass on the root (canonical name for NgComponentOutlet)', () => {
    fixture.componentRef.setInput('cssClass', 'my-extra-class');
    fixture.detectChanges();

    expect(root().className).toContain('my-extra-class');
  });
});
