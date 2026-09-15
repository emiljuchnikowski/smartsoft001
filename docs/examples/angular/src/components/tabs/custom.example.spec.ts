import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import {
  CustomTabsComponent,
  TabsCustomExampleComponent,
} from './custom.example';

describe('docs-examples-angular: TabsCustomExampleComponent', () => {
  let fixture: ComponentFixture<TabsCustomExampleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsCustomExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TabsCustomExampleComponent);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should render the custom tabs through the wrapper instead of the standard one', () => {
    expect(element.querySelector('smart-tabs docs-custom-tabs')).toBeTruthy();
    expect(element.querySelector('smart-tabs-standard')).toBeNull();
  });

  it('should mark the forwarded selectedId as the current tab', () => {
    const current = element.querySelector('.docs-tabs__tab--current');

    expect(current?.textContent).toContain('Billing');
    expect(current?.getAttribute('aria-current')).toBe('page');
  });

  // NgComponentOutlet forwards inputs but not outputs, so the wrapper's
  // (tabChange) never fires; the custom instance emits it.
  it('should select a clicked tab and emit tabChange from the custom instance', () => {
    const tabs: CustomTabsComponent = fixture.debugElement.query(
      By.directive(CustomTabsComponent),
    ).componentInstance;
    const emitted: string[] = [];
    tabs.tabChange.subscribe((event) => emitted.push(event.tabId));

    const buttons =
      element.querySelectorAll<HTMLButtonElement>('.docs-tabs__tab');
    buttons[2].click();
    fixture.detectChanges();

    expect(emitted).toEqual(['members']);
    expect(tabs.selectedId()).toBe('members');
    expect(
      element.querySelector('.docs-tabs__tab--current')?.textContent,
    ).toContain('Members');
  });
});
