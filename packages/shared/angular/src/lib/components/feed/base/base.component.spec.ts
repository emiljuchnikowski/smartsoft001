import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedBaseComponent } from './base.component';
import { IFeedOptions } from '../../../models';

@Component({
  selector: 'smart-test-feed',
  template: '',
})
class TestFeedComponent extends FeedBaseComponent {}

@Component({
  selector: 'smart-test-host',
  template: `<smart-test-feed [options]="options" [class]="cssClass" />`,
  imports: [TestFeedComponent],
})
class TestHostComponent {
  options: IFeedOptions | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: FeedBaseComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let directive: TestFeedComponent;

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
    expect(directive).toBeInstanceOf(FeedBaseComponent);
  });

  it('should have smartType static equal to "feed"', () => {
    expect(FeedBaseComponent.smartType).toBe('feed');
  });

  it('should default options to undefined', () => {
    expect(directive.options()).toBeUndefined();
  });

  it('should default cssClass to empty string', () => {
    expect(directive.cssClass()).toBe('');
  });

  it('should accept cssClass via class alias', async () => {
    host.cssClass = 'my-class';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.cssClass()).toBe('my-class');
  });

  it('should accept IFeedOptions via options input', async () => {
    host.options = {
      title: 'Activity',
      events: [
        { id: '1', title: 'Created invoice', timestamp: '2026-01-23T10:32' },
      ],
    };
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.options()).toEqual({
      title: 'Activity',
      events: [
        { id: '1', title: 'Created invoice', timestamp: '2026-01-23T10:32' },
      ],
    });
  });
});
