import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiColumnLayoutUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: MultiColumnLayoutUsageExampleComponent', () => {
  let fixture: ComponentFixture<MultiColumnLayoutUsageExampleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiColumnLayoutUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MultiColumnLayoutUsageExampleComponent);
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should render the header and navigation templates from the options', () => {
    expect(element.querySelector('header')?.textContent).toContain('Inbox');
    expect(element.querySelector('aside.nav')?.textContent).toContain('Drafts');
  });

  it('should render the secondary column template from the options', () => {
    expect(element.querySelector('aside.secondary')?.textContent).toContain(
      '4.2 GB of 15 GB used',
    );
  });

  it('should render the projected content in the main column', () => {
    expect(element.querySelector('main')?.textContent).toContain(
      'Quarterly report is ready',
    );
  });
});
