import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPanelPresetComponent } from './preset.component';
import { IActionPanelOptions, SmartActionPanelLayout } from '../../../models';

@Component({
  selector: 'smart-test-action-panel-templates',
  template: `
    <ng-template #description
      ><span class="tpl-description">Rich description</span></ng-template
    >
    <ng-template #content
      ><div class="tpl-content">Panel body</div></ng-template
    >
  `,
})
class TemplatesHostComponent {
  @ViewChild('description', { static: true })
  description!: TemplateRef<unknown>;
  @ViewChild('content', { static: true }) content!: TemplateRef<unknown>;
}

describe('@smartsoft001/shared-angular: ActionPanelPresetComponent', () => {
  let fixture: ComponentFixture<ActionPanelPresetComponent>;
  let component: ActionPanelPresetComponent;
  let tpl: TemplatesHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionPanelPresetComponent, TemplatesHostComponent],
    }).compileComponents();

    const tplFixture = TestBed.createComponent(TemplatesHostComponent);
    tplFixture.detectChanges();
    tpl = tplFixture.componentInstance;

    fixture = TestBed.createComponent(ActionPanelPresetComponent);
    component = fixture.componentInstance;
  });

  const el = (): HTMLElement => fixture.nativeElement as HTMLElement;
  const role = (name: string): HTMLElement | null =>
    el().querySelector(`[data-role="${name}"]`);
  const roles = (name: string): HTMLElement[] =>
    Array.from(el().querySelectorAll(`[data-role="${name}"]`));

  function render(options: IActionPanelOptions): void {
    fixture.componentRef.setInput('options', options);
    fixture.detectChanges();
  }

  it('should create an instance with a panel card', () => {
    render({ title: 'Settings' });

    expect(component).toBeInstanceOf(ActionPanelPresetComponent);
    const panel = role('panel');
    expect(panel).toBeTruthy();
    expect(panel!.className).toContain('smart:rounded-xl');
    expect(panel!.className).toContain('smart:bg-white');
  });

  describe('content zones', () => {
    it('should render the title with heading classes', () => {
      render({ title: 'Delete account' });

      const title = role('title');
      expect(title!.textContent).toContain('Delete account');
      expect(title!.className).toContain('smart:font-semibold');
      expect(title!.className).toContain('smart:text-gray-900');
    });

    it('should render the plain description text', () => {
      render({ title: 'A', description: 'Some helper text' });

      const description = role('description');
      expect(description!.textContent).toContain('Some helper text');
      expect(description!.className).toContain('smart:text-gray-500');
    });

    it('should let descriptionTpl override the description text', () => {
      render({
        title: 'A',
        description: 'ignored',
        descriptionTpl: tpl.description,
      });

      const description = role('description');
      expect(description!.querySelector('.tpl-description')).toBeTruthy();
      expect(description!.textContent).not.toContain('ignored');
    });

    it('should render contentTpl inside the content zone', () => {
      render({ title: 'A', contentTpl: tpl.content });

      const content = role('content');
      expect(content).toBeTruthy();
      expect(content!.querySelector('.tpl-content')).toBeTruthy();
    });
  });

  describe('actions', () => {
    it('should render each action with data-role and data-action-id', () => {
      render({
        title: 'A',
        actions: [
          { id: 'save', label: 'Save' },
          { id: 'cancel', label: 'Cancel' },
        ],
      });

      const actionEls = roles('action');
      expect(actionEls.length).toBe(2);
      expect(actionEls.map((a) => a.getAttribute('data-action-id'))).toEqual([
        'save',
        'cancel',
      ]);
      expect(role('actions')).toBeTruthy();
    });

    it('should emit actionClick with the id when a button action is clicked', () => {
      const emitted: string[] = [];
      render({ title: 'A', actions: [{ id: 'delete', label: 'Delete' }] });
      component.actionClick.subscribe((e) => emitted.push(e.actionId));

      (el().querySelector('[data-action-id="delete"]') as HTMLElement).click();

      expect(emitted).toEqual(['delete']);
    });

    it('should style a primary action as a solid blue button', () => {
      render({
        title: 'A',
        actions: [{ id: 'save', label: 'Save', variant: 'primary' }],
      });

      const button = el().querySelector('[data-action-id="save"]')!;
      expect(button.className).toContain('smart:bg-blue-600');
      expect(button.className).toContain('smart:text-white');
    });

    it('should style a non-primary action as an outline button', () => {
      render({
        title: 'A',
        actions: [{ id: 'cancel', label: 'Cancel', variant: 'secondary' }],
      });

      const button = el().querySelector('[data-action-id="cancel"]')!;
      expect(button.className).toContain('smart:border-gray-200');
      expect(button.className).not.toContain('smart:bg-blue-600');
    });

    it('should render an href action as an anchor', () => {
      render({
        title: 'A',
        actions: [{ id: 'docs', label: 'Docs', href: '/docs' }],
      });

      const anchor = el().querySelector('[data-action-id="docs"]')!;
      expect(anchor.tagName).toBe('A');
      expect(anchor.getAttribute('href')).toBe('/docs');
    });
  });

  describe('layouts', () => {
    const layouts: SmartActionPanelLayout[] = [
      'simple',
      'with-link',
      'right-button',
      'top-right-button',
      'with-toggle',
      'with-input',
      'well',
      'payment-method',
    ];

    layouts.forEach((layout) => {
      it(`should render the "${layout}" layout and expose it via data-layout`, () => {
        render({
          title: 'A',
          description: 'B',
          contentTpl: tpl.content,
          layout,
          actions: [{ id: 'go', label: 'Go' }],
        });

        expect(role('panel')!.getAttribute('data-layout')).toBe(layout);
        expect(role('title')).toBeTruthy();
        expect(role('actions')).toBeTruthy();
      });
    });

    it('should default to the simple layout when none is given', () => {
      render({ title: 'A', actions: [{ id: 'go', label: 'Go' }] });

      expect(role('panel')!.getAttribute('data-layout')).toBe('simple');
    });

    it('should render actions as underlined links for the with-link layout', () => {
      render({
        title: 'A',
        layout: 'with-link',
        actions: [{ id: 'more', label: 'Learn more' }],
      });

      const action = el().querySelector('[data-action-id="more"]')!;
      expect(action.className).toContain('smart:text-blue-600');
      expect(action.className).toContain('smart:hover:underline');
    });

    it('should wrap content in an inner well panel for the well layout', () => {
      render({
        title: 'A',
        layout: 'well',
        contentTpl: tpl.content,
        actions: [{ id: 'go', label: 'Go' }],
      });

      const well = role('well');
      expect(well).toBeTruthy();
      expect(well!.className).toContain('smart:bg-gray-50');
      expect(well!.querySelector('[data-role="content"]')).toBeTruthy();
    });

    it('should arrange right-button layout as a flex row', () => {
      render({
        title: 'A',
        layout: 'right-button',
        actions: [{ id: 'go', label: 'Go' }],
      });

      const rowHost = role('panel')!.firstElementChild as HTMLElement;
      expect(rowHost.className).toContain('smart:flex');
      expect(rowHost.className).toContain('smart:justify-between');
    });
  });

  describe('cssClass override', () => {
    it('should bind the canonical cssClass input (no class alias) onto the panel', () => {
      fixture.componentRef.setInput('cssClass', 'my-extra');
      fixture.componentRef.setInput('options', { title: 'A' });
      fixture.detectChanges();

      expect(role('panel')!.className).toContain('my-extra');
    });
  });
});
