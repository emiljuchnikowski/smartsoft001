import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { DetailsUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: DetailsUsageExampleComponent', () => {
  let fixture: ComponentFixture<DetailsUsageExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsUsageExampleComponent],
      // App-wide services, provided once in the application's root config.
      providers: [provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsUsageExampleComponent);
    fixture.detectChanges();
  });

  it('should render the item values from the options', () => {
    const details: HTMLElement = fixture.nativeElement;

    expect(details.textContent).toContain('Margot Foster');
    expect(details.textContent).toContain('margot.foster@example.com');
  });
});
