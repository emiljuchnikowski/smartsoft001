import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaObjectUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: MediaObjectUsageExampleComponent', () => {
  let fixture: ComponentFixture<MediaObjectUsageExampleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaObjectUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MediaObjectUsageExampleComponent);
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should render the media from the inputs', () => {
    const image = element.querySelector('img');

    expect(image?.getAttribute('src')).toBe(
      fixture.componentInstance.avatarUrl,
    );
    expect(image?.getAttribute('alt')).toBe('Portrait of Lindsay Walton');
  });

  it('should apply the alignment from the options', () => {
    const container = element.querySelector('[data-alignment]');

    expect(container?.getAttribute('data-alignment')).toBe('center');
  });

  it('should render the projected body next to the media', () => {
    expect(element.textContent).toContain('Lindsay Walton');
    expect(element.textContent).toContain('Joined the design systems team');
  });
});
