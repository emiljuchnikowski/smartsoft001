import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: TabsUsageExampleComponent', () => {
  let fixture: ComponentFixture<TabsUsageExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TabsUsageExampleComponent);
    fixture.detectChanges();
  });

  it('should render the tabs from the options and mark the selected one', () => {
    const current: HTMLButtonElement = fixture.nativeElement.querySelector(
      'nav button[aria-current="page"]',
    );

    expect(fixture.nativeElement.textContent).toContain('Team members');
    expect(current.textContent).toContain('My account');
  });

  it('should hand the clicked tab id to the handler and update the selection', () => {
    const tabs: NodeListOf<HTMLButtonElement> =
      fixture.nativeElement.querySelectorAll('nav button');

    tabs[2].click();

    expect(fixture.componentInstance.lastTab()).toBe('team');
    expect(fixture.componentInstance.selectedTab()).toBe('team');
  });
});
