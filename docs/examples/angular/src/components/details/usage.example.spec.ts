import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';

import { SharedModule } from '@smartsoft001/angular';

import { DetailsUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: DetailsUsageExampleComponent', () => {
  let fixture: ComponentFixture<DetailsUsageExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // App-wide services, provided once in the application's root config:
      // SharedModule registers the library's dictionary.
      imports: [DetailsUsageExampleComponent, SharedModule],
      providers: [provideTranslateService()],
    }).compileComponents();

    TestBed.inject(TranslateService).use('eng');
    fixture = TestBed.createComponent(DetailsUsageExampleComponent);
    fixture.detectChanges();
  });

  it('should render the item values from the options', () => {
    // Arrange
    const details: HTMLElement = fixture.nativeElement;

    // Assert
    expect(details.textContent).toContain('Margot');
    expect(details.textContent).toContain('Foster');
  });

  it('should render the email field as a mailto link', () => {
    // Arrange
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector(
      'smart-detail-email a',
    );

    // Assert
    expect(link.getAttribute('href')).toBe('mailto:margot.foster@example.com');
  });

  it('should label each field with its MODEL.<key> translation', () => {
    // Arrange
    const labels = Array.from(
      fixture.nativeElement.querySelectorAll('smart-detail span.smart\\:block'),
      (label: Element) => label.textContent?.trim(),
    );

    // Assert
    expect(labels).toEqual(['first name', 'last name', 'email']);
  });
});
