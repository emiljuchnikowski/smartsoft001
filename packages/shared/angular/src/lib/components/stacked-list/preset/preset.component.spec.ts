import {
  ChangeDetectionStrategy,
  Component,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StackedListPresetComponent } from './preset.component';
import { IStackedListOptions } from '../../../models';
import { STACKED_LIST_STANDARD_COMPONENT_TOKEN } from '../../../shared.inectors';
import { StackedListBaseComponent } from '../base';
import { StackedListComponent } from '../stacked-list.component';

describe('@smartsoft001/shared-angular: StackedListPresetComponent', () => {
  let fixture: ComponentFixture<StackedListPresetComponent>;
  let component: StackedListPresetComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StackedListPresetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StackedListPresetComponent);
    component = fixture.componentInstance;
  });

  function setOptions(options: IStackedListOptions): void {
    fixture.componentRef.setInput('options', options);
    fixture.detectChanges();
  }

  function root(): HTMLElement {
    return fixture.nativeElement.firstElementChild as HTMLElement;
  }

  function list(): HTMLElement | null {
    return fixture.nativeElement.querySelector('ul[role="list"]');
  }

  it('should extend StackedListBaseComponent', () => {
    fixture.detectChanges();

    expect(component).toBeInstanceOf(StackedListBaseComponent);
  });

  it('should render the title and description with dark-mode classes', () => {
    setOptions({ title: 'Team members', description: 'People with access' });

    const title = fixture.nativeElement.querySelector('h3') as HTMLElement;
    const description = fixture.nativeElement.querySelector('p') as HTMLElement;

    expect(title.textContent).toContain('Team members');
    expect(title.className).toContain('smart:text-gray-900');
    expect(title.className).toContain('smart:dark:text-white');
    expect(description.textContent).toContain('People with access');
    expect(description.className).toContain('smart:dark:text-gray-400');
  });

  it('should not render the list when there are no items', () => {
    setOptions({ title: 'Team members' });

    expect(list()).toBeNull();
  });

  it('should render one row per item with title, description and meta', () => {
    setOptions({
      items: [
        {
          id: '1',
          title: 'Lindsay Walton',
          description: 'lindsay@example.com',
          meta: 'Joined 2026',
        },
        { id: '2', title: 'Courtney Henry' },
      ],
    });

    const rows = fixture.nativeElement.querySelectorAll('li');

    expect(rows.length).toBe(2);
    expect(rows[0].textContent).toContain('Lindsay Walton');
    expect(rows[0].textContent).toContain('lindsay@example.com');
    expect(rows[0].textContent).toContain('Joined 2026');
  });

  it('should render the title as a link when href is set', () => {
    setOptions({ items: [{ title: 'Report.pdf', href: '/files/report' }] });

    const link = fixture.nativeElement.querySelector('li a') as HTMLElement;

    expect(link.getAttribute('href')).toBe('/files/report');
    expect(link.textContent?.trim()).toBe('Report.pdf');
    expect(link.className).toContain('smart:dark:text-white');
  });

  it('should render a rounded avatar when avatarUrl is set', () => {
    setOptions({ items: [{ title: 'Lindsay', avatarUrl: '/a.png' }] });

    const img = fixture.nativeElement.querySelector('li img') as HTMLElement;

    expect(img.getAttribute('src')).toBe('/a.png');
    expect(img.className).toContain('smart:rounded-full');
    expect(img.className).toContain('smart:dark:bg-gray-800');
  });

  it('should set aria-label on the row when ariaLabel is set', () => {
    setOptions({ items: [{ title: 'Lindsay', ariaLabel: 'Member Lindsay' }] });

    const row = fixture.nativeElement.querySelector('li') as HTMLElement;

    expect(row.getAttribute('aria-label')).toBe('Member Lindsay');
  });

  it('should draw dividers between rows when withDividers is true', () => {
    setOptions({ withDividers: true, items: [{ title: 'A' }, { title: 'B' }] });

    expect(list()?.className).toContain('smart:divide-y');
    expect(list()?.className).toContain('smart:divide-gray-100');
    expect(list()?.className).toContain('smart:dark:divide-white/10');
  });

  it('should not draw dividers when withDividers is not set', () => {
    setOptions({ items: [{ title: 'A' }, { title: 'B' }] });

    expect(list()?.className).not.toContain('smart:divide-y');
  });

  it('should render the list as an edge-to-edge card on mobile when fullWidthOnMobile is true', () => {
    setOptions({ fullWidthOnMobile: true, items: [{ title: 'A' }] });

    const row = fixture.nativeElement.querySelector('li') as HTMLElement;

    expect(list()?.className).toContain('smart:-mx-4');
    expect(list()?.className).toContain('smart:sm:mx-0');
    expect(list()?.className).toContain('smart:sm:rounded-xl');
    expect(list()?.className).toContain('smart:dark:bg-gray-900');
    expect(row.className).toContain('smart:px-4');
    expect(row.className).toContain('smart:sm:px-6');
  });

  it('should render a plain list without card padding when fullWidthOnMobile is not set', () => {
    setOptions({ items: [{ title: 'A' }] });

    const row = fixture.nativeElement.querySelector('li') as HTMLElement;

    expect(list()?.className).not.toContain('smart:-mx-4');
    expect(row.className).not.toContain('smart:px-4');
  });

  it('should apply cssClass on the root (canonical name for NgComponentOutlet)', () => {
    fixture.componentRef.setInput('cssClass', 'my-extra-class');
    fixture.detectChanges();

    expect(root().className).toContain('my-extra-class');
  });

  describe('templates', () => {
    @Component({
      selector: 'smart-test-stacked-list-preset-host',
      changeDetection: ChangeDetectionStrategy.Eager,
      imports: [StackedListPresetComponent],
      template: `
        <ng-template #iconTpl><svg class="custom-icon"></svg></ng-template>
        <ng-template #badgeTpl
          ><span class="custom-badge">Active</span></ng-template
        >
        <ng-template #actionTpl
          ><button class="custom-action">Remove</button></ng-template
        >
        <ng-template #emptyTpl
          ><p class="custom-empty">No members</p></ng-template
        >
        <ng-template #footerTpl
          ><a class="custom-footer">Load more</a></ng-template
        >
        @if (options(); as opts) {
          <smart-stacked-list-preset [options]="opts" />
        }
      `,
    })
    class HostComponent {
      iconTpl = viewChild.required<TemplateRef<unknown>>('iconTpl');
      badgeTpl = viewChild.required<TemplateRef<unknown>>('badgeTpl');
      actionTpl = viewChild.required<TemplateRef<unknown>>('actionTpl');
      emptyTpl = viewChild.required<TemplateRef<unknown>>('emptyTpl');
      footerTpl = viewChild.required<TemplateRef<unknown>>('footerTpl');

      options = signal<IStackedListOptions | null>(null);
    }

    let hostFixture: ComponentFixture<HostComponent>;
    let host: HostComponent;

    beforeEach(async () => {
      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [HostComponent],
      }).compileComponents();

      hostFixture = TestBed.createComponent(HostComponent);
      host = hostFixture.componentInstance;
      hostFixture.detectChanges();
    });

    function render(
      build: (h: HostComponent) => IStackedListOptions,
    ): HTMLElement {
      host.options.set(build(host));
      hostFixture.detectChanges();

      return hostFixture.nativeElement as HTMLElement;
    }

    it('should render iconTpl in a rounded tile, taking precedence over avatarUrl', () => {
      const el = render((h) => ({
        items: [{ title: 'A', iconTpl: h.iconTpl(), avatarUrl: '/a.png' }],
      }));

      expect(el.querySelector('li svg.custom-icon')).toBeTruthy();
      expect(el.querySelector('li img')).toBeNull();
    });

    it('should render badgeTpl and actionTpl in the row', () => {
      const el = render((h) => ({
        items: [
          { title: 'A', badgeTpl: h.badgeTpl(), actionTpl: h.actionTpl() },
        ],
      }));

      expect(el.querySelector('li .custom-badge')).toBeTruthy();
      expect(el.querySelector('li .custom-action')).toBeTruthy();
    });

    it('should render emptyTpl when there are no items', () => {
      const el = render((h) => ({ items: [], emptyTpl: h.emptyTpl() }));

      const empty = el.querySelector('.custom-empty')
        ?.parentElement as HTMLElement;

      expect(empty).toBeTruthy();
      expect(empty.className).toContain('smart:dark:text-gray-400');
    });

    it('should not render emptyTpl when there are items', () => {
      const el = render((h) => ({
        items: [{ title: 'A' }],
        emptyTpl: h.emptyTpl(),
      }));

      expect(el.querySelector('.custom-empty')).toBeNull();
    });

    it('should render footerTpl under the list', () => {
      const el = render((h) => ({
        items: [{ title: 'A' }],
        footerTpl: h.footerTpl(),
      }));

      expect(el.querySelector('.custom-footer')).toBeTruthy();
    });
  });

  describe('registered on STACKED_LIST_STANDARD_COMPONENT_TOKEN', () => {
    it('should render through <smart-stacked-list> and forward the external class', async () => {
      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [StackedListComponent],
        providers: [
          {
            provide: STACKED_LIST_STANDARD_COMPONENT_TOKEN,
            useValue: StackedListPresetComponent,
          },
        ],
      }).compileComponents();
      const wrapper = TestBed.createComponent(StackedListComponent);
      wrapper.componentRef.setInput('options', {
        title: 'Team members',
        items: [{ title: 'Lindsay Walton' }],
      });
      wrapper.componentRef.setInput('class', 'wrapper-class');

      wrapper.detectChanges();

      const preset = wrapper.nativeElement.querySelector(
        'smart-stacked-list-preset',
      ) as HTMLElement;
      expect(preset).toBeTruthy();
      expect(preset.textContent).toContain('Lindsay Walton');
      expect((preset.firstElementChild as HTMLElement).className).toContain(
        'wrapper-class',
      );
      expect(
        wrapper.nativeElement.querySelector('smart-stacked-list-standard'),
      ).toBeNull();
    });
  });
});
