import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListContainerUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: ListContainerUsageExampleComponent', () => {
  let fixture: ComponentFixture<ListContainerUsageExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListContainerUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListContainerUsageExampleComponent);
    fixture.detectChanges();
  });

  it('should apply the variant from the options', () => {
    const list: HTMLElement =
      fixture.nativeElement.querySelector('[role="list"]');

    expect(list.getAttribute('data-variant')).toBe('card-dividers');
  });

  it('should project one list item per notification', () => {
    const items = fixture.nativeElement.querySelectorAll(
      '[role="list"] [role="listitem"]',
    );

    expect(items.length).toBe(3);
    expect(items[0].textContent).toContain('Invoice #1042 was paid');
  });
});
