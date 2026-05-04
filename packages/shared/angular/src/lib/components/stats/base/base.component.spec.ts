import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsBaseComponent } from './base.component';
import { IStatsOptions } from '../../../models';

@Component({
  selector: 'smart-test-stats',
  template: '',
})
class TestStatsComponent extends StatsBaseComponent {}

@Component({
  selector: 'smart-test-host',
  template: `<smart-test-stats [options]="options" [class]="cssClass" />`,
  imports: [TestStatsComponent],
})
class TestHostComponent {
  options: IStatsOptions | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: StatsBaseComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let directive: TestStatsComponent;

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
    expect(directive).toBeInstanceOf(StatsBaseComponent);
  });

  it('should have smartType static equal to "stats"', () => {
    expect(StatsBaseComponent.smartType).toBe('stats');
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

  it('should accept IStatsOptions via options input', async () => {
    host.options = {
      items: [{ label: 'Revenue', value: '$405,091' }],
    };
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.options()).toEqual({
      items: [{ label: 'Revenue', value: '$405,091' }],
    });
  });
});
