import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaObjectStandardComponent } from './standard.component';
import { IMediaObjectOptions } from '../../../models';

@Component({
  selector: 'smart-test-host',
  template: `<smart-media-object-standard
    [mediaUrl]="mediaUrl"
    [mediaAlt]="mediaAlt"
    [options]="options"
    [class]="cssClass"
  >
    <span class="projected-body">Body content</span>
  </smart-media-object-standard>`,
  imports: [MediaObjectStandardComponent],
})
class TestHostComponent {
  mediaUrl = 'https://example.com/image.png';
  mediaAlt = 'Example image';
  options: IMediaObjectOptions | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: MediaObjectStandardComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render an <img> element with the mediaUrl as src', () => {
    const img: HTMLImageElement = fixture.nativeElement.querySelector('img');

    expect(img).toBeTruthy();
    expect(img.getAttribute('src')).toBe('https://example.com/image.png');
  });

  it('should render the <img> element with the mediaAlt as alt', () => {
    const img: HTMLImageElement = fixture.nativeElement.querySelector('img');

    expect(img.getAttribute('alt')).toBe('Example image');
  });

  it('should project content into the body slot', () => {
    const body = fixture.nativeElement.querySelector(
      '.smart-media-object-body',
    );

    expect(body).toBeTruthy();
    expect(body.querySelector('.projected-body')).toBeTruthy();
    expect(body.textContent).toContain('Body content');
  });

  it('should default data-position to "left" when no options provided', () => {
    const wrapper = fixture.nativeElement.querySelector(
      'smart-media-object-standard > div',
    );

    expect(wrapper.getAttribute('data-position')).toBe('left');
  });

  it('should not set data-alignment when no options provided', () => {
    const wrapper = fixture.nativeElement.querySelector(
      'smart-media-object-standard > div',
    );

    expect(wrapper.getAttribute('data-alignment')).toBeNull();
  });

  it('should reflect options.position via data-position attribute', async () => {
    host.options = { position: 'right' };
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    const wrapper = fixture.nativeElement.querySelector(
      'smart-media-object-standard > div',
    );

    expect(wrapper.getAttribute('data-position')).toBe('right');
  });

  it('should reflect options.alignment via data-alignment attribute', async () => {
    host.options = { alignment: 'center' };
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    const wrapper = fixture.nativeElement.querySelector(
      'smart-media-object-standard > div',
    );

    expect(wrapper.getAttribute('data-alignment')).toBe('center');
  });

  it('should apply external cssClass on the wrapper div', async () => {
    host.cssClass = 'my-extra-class';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    const wrapper = fixture.nativeElement.querySelector(
      'smart-media-object-standard > div',
    );

    expect(wrapper.className).toContain('my-extra-class');
  });
});
