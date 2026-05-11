import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaObjectBaseComponent } from './base.component';
import { IMediaObjectOptions } from '../../../models';

@Component({
  selector: 'smart-test-media-object',
  template: '',
})
class TestMediaObjectComponent extends MediaObjectBaseComponent {}

@Component({
  selector: 'smart-test-host',
  template: `<smart-test-media-object
    [mediaUrl]="mediaUrl"
    [mediaAlt]="mediaAlt"
    [options]="options"
    [class]="cssClass"
  />`,
  imports: [TestMediaObjectComponent],
})
class TestHostComponent {
  mediaUrl = 'https://example.com/image.png';
  mediaAlt = 'Example image';
  options: IMediaObjectOptions | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: MediaObjectBaseComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let directive: TestMediaObjectComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    directive = fixture.debugElement.children[0].componentInstance;
  });

  it('should create an instance when extended', () => {
    expect(directive).toBeInstanceOf(MediaObjectBaseComponent);
  });

  it('should have smartType static equal to "media-object"', () => {
    expect(MediaObjectBaseComponent.smartType).toBe('media-object');
  });

  it('should expose required mediaUrl from host', () => {
    expect(directive.mediaUrl()).toBe('https://example.com/image.png');
  });

  it('should expose required mediaAlt from host', () => {
    expect(directive.mediaAlt()).toBe('Example image');
  });

  it('should default cssClass to empty string', () => {
    expect(directive.cssClass()).toBe('');
  });

  it('should default options to undefined', () => {
    expect(directive.options()).toBeUndefined();
  });

  it('should accept cssClass via class alias', async () => {
    host.cssClass = 'my-class';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.cssClass()).toBe('my-class');
  });

  it('should accept IMediaObjectOptions via options input', async () => {
    host.options = { position: 'right', alignment: 'center' };
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.options()).toEqual({
      position: 'right',
      alignment: 'center',
    });
  });
});
