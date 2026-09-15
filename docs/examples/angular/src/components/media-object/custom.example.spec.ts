import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaObjectCustomExampleComponent } from './custom.example';

describe('docs-examples-angular: MediaObjectCustomExampleComponent', () => {
  let fixture: ComponentFixture<MediaObjectCustomExampleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaObjectCustomExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MediaObjectCustomExampleComponent);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should render the custom media object through the wrapper instead of the standard one', () => {
    expect(
      element.querySelector('smart-media-object docs-custom-media-object'),
    ).toBeTruthy();
    expect(element.querySelector('smart-media-object-standard')).toBeNull();
  });

  it('should render the forwarded media url and alt text on the thumbnail', () => {
    const image = element.querySelector<HTMLImageElement>(
      '.docs-media-object__media',
    );

    expect(image?.getAttribute('src')).toContain('unsplash.com');
    expect(image?.getAttribute('alt')).toBe('Portrait of Lindsay Walton');
  });

  it('should reflect the alignment and position taken from the options', () => {
    const article = element.querySelector('.docs-media-object');

    expect(article?.getAttribute('data-alignment')).toBe('center');
    expect(article?.getAttribute('data-position')).toBe('right');
  });

  it('should append the class forwarded through the wrapper', () => {
    const article = element.querySelector('.docs-media-object');

    expect(article?.classList).toContain('docs-media-object--demo');
  });
});
