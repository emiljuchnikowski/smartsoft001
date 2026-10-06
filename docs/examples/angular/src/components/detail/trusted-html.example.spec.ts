import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { DetailTrustedHtmlExampleComponent } from './trusted-html.example';

describe('docs-examples-angular: DetailTrustedHtmlExampleComponent', () => {
  let fixture: ComponentFixture<DetailTrustedHtmlExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailTrustedHtmlExampleComponent],
      providers: [provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailTrustedHtmlExampleComponent);
    fixture.detectChanges();
  });

  function field(testId: string): HTMLElement {
    return fixture.nativeElement.querySelector(
      `[data-testid="${testId}"] smart-detail-text`,
    );
  }

  it('should strip the inline style when the value is rendered as is', () => {
    const span = field('sanitized').querySelector('span');

    expect(span?.textContent).toBe('Limited edition');
    expect(span?.getAttribute('style')).toBeNull();
  });

  it('should keep the inline style when the cellPipe returns SafeHtml', () => {
    const span = field('trusted').querySelector('span');

    expect(span?.textContent).toBe('Limited edition');
    expect(span?.getAttribute('style')).toContain('color');
  });
});
