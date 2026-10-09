import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';

import { SharedModule } from '@smartsoft001/angular';

import { DetailUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: DetailUsageExampleComponent', () => {
  let fixture: ComponentFixture<DetailUsageExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // App-wide services, provided once in the application's root config:
      // SharedModule registers the library's dictionary.
      imports: [DetailUsageExampleComponent, SharedModule],
      providers: [provideTranslateService()],
    }).compileComponents();

    TestBed.inject(TranslateService).use('eng');
    fixture = TestBed.createComponent(DetailUsageExampleComponent);
    fixture.detectChanges();
  });

  it('should render the text field value read from the item', () => {
    // Arrange
    const element: HTMLElement = fixture.nativeElement;

    // Assert
    expect(element.querySelector('smart-detail-text')?.textContent).toContain(
      'Margot',
    );
  });

  it('should render the email field as a mailto link', () => {
    // Arrange
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector(
      'smart-detail-email a',
    );

    // Assert
    expect(link.getAttribute('href')).toBe('mailto:margot@example.com');
  });

  it('should label each field with its MODEL.<key> translation', () => {
    // Arrange
    const labels = Array.from(
      fixture.nativeElement.querySelectorAll('smart-detail span.smart\\:block'),
      (label: Element) => label.textContent?.trim(),
    );

    // Assert
    expect(labels).toEqual(['first name', 'email']);
  });
});
