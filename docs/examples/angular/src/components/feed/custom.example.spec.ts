import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedCustomExampleComponent } from './custom.example';

describe('docs-examples-angular: FeedCustomExampleComponent', () => {
  let fixture: ComponentFixture<FeedCustomExampleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedCustomExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeedCustomExampleComponent);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should render the custom feed through the wrapper instead of the standard one', () => {
    expect(element.querySelector('smart-feed docs-custom-feed')).toBeTruthy();
    expect(element.querySelector('smart-feed-standard')).toBeNull();
    expect(element.querySelector('.docs-feed__title')?.textContent).toContain(
      'Application activity',
    );
  });

  it('should render only the first two events until the feed is expanded', () => {
    const events = element.querySelectorAll('.docs-feed__event');

    expect(events).toHaveLength(2);
    expect(events[0]?.textContent).toContain('Applied to Front End Developer');
  });

  it('should render every event after clicking "Show all"', () => {
    element.querySelector<HTMLButtonElement>('.docs-feed__more')?.click();
    fixture.detectChanges();

    expect(element.querySelectorAll('.docs-feed__event')).toHaveLength(3);
    expect(element.querySelector('.docs-feed__more')).toBeNull();
  });
});
