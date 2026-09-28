import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { SearchbarUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: SearchbarUsageExampleComponent', () => {
  let fixture: ComponentFixture<SearchbarUsageExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchbarUsageExampleComponent],
      // The app provides translations once, in app.config.ts.
      providers: [provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchbarUsageExampleComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render the input with the placeholder from the options', () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector(
      'input[type="search"]',
    );

    expect(input.placeholder).toBe('Search orders');
  });

  it('should write the typed text into the bound signal after the debounce', () => {
    jest.useFakeTimers();
    const input: HTMLInputElement = fixture.nativeElement.querySelector(
      'input[type="search"]',
    );

    input.value = 'invoice';
    input.dispatchEvent(new Event('input'));
    jest.advanceTimersByTime(300);
    fixture.detectChanges();

    expect(fixture.componentInstance.query()).toBe('invoice');
  });
});
