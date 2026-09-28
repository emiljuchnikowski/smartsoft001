import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: FeedUsageExampleComponent', () => {
  let fixture: ComponentFixture<FeedUsageExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeedUsageExampleComponent);
    fixture.detectChanges();
  });

  it('should render one entry per event from the options', () => {
    const events = fixture.nativeElement.querySelectorAll('li.event');

    expect(events).toHaveLength(3);
    expect(events[0].textContent).toContain('Applied to Front End Developer');
  });

  it('should render the comments of an event', () => {
    const comment: HTMLElement =
      fixture.nativeElement.querySelector('li.comment');

    expect(comment.textContent).toContain('Chelsea Hagon');
    expect(comment.textContent).toContain('Looks great, approved.');
  });
});
