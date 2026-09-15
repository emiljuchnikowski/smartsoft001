import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { DetailCustomExampleComponent } from './custom.example';

describe('docs-examples-angular: DetailCustomExampleComponent', () => {
  let fixture: ComponentFixture<DetailCustomExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailCustomExampleComponent],
      // <smart-detail> renders the field label through ModelLabelPipe, which
      // injects TranslateService.
      providers: [provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailCustomExampleComponent);
    fixture.detectChanges();
  });

  it('should render the custom text field instead of the built-in one', () => {
    const custom = fixture.nativeElement.querySelector('.docs-detail-text');
    const builtIn = fixture.nativeElement.querySelector('smart-detail-text');

    expect(custom).toBeTruthy();
    expect(builtIn).toBeNull();
  });

  it('should render the value read from the item under the given key', () => {
    const custom = fixture.nativeElement.querySelector('.docs-detail-text');

    expect(custom.textContent).toContain('Margot Foster');
  });

  it('should append the class forwarded by smart-detail', () => {
    const custom: HTMLElement =
      fixture.nativeElement.querySelector('.docs-detail-text');

    expect(custom.classList).toContain('docs-detail-text--demo');
  });
});
