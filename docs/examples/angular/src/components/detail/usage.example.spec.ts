import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { DetailUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: DetailUsageExampleComponent', () => {
  let fixture: ComponentFixture<DetailUsageExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailUsageExampleComponent],
      // App-wide services, provided once in the application's root config.
      providers: [provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailUsageExampleComponent);
    fixture.detectChanges();
  });

  it('should render the text field value read from the item', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('smart-detail-text')?.textContent).toContain(
      'Margot Foster',
    );
  });

  it('should render the email field as a mailto link', () => {
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector(
      'smart-detail-email a',
    );

    expect(link.getAttribute('href')).toBe('mailto:margot@example.com');
  });

  it('should label each field by its key', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('MODEL.email');
  });
});
