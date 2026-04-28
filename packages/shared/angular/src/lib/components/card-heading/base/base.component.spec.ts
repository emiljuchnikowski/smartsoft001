import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardHeadingBaseComponent } from './base.component';
import { ICardHeadingOptions } from '../../../models';

@Component({
  selector: 'smart-test-card-heading',
  template: '',
})
class TestCardHeadingComponent extends CardHeadingBaseComponent {}

@Component({
  selector: 'smart-test-host',
  template: `<smart-test-card-heading
    [options]="options"
    [class]="cssClass"
  />`,
  imports: [TestCardHeadingComponent],
})
class TestHostComponent {
  options: ICardHeadingOptions | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: CardHeadingBaseComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let directive: TestCardHeadingComponent;

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
    expect(directive).toBeInstanceOf(CardHeadingBaseComponent);
  });

  it('should have smartType static equal to "card-heading"', () => {
    expect(CardHeadingBaseComponent.smartType).toBe('card-heading');
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

  it('should accept ICardHeadingOptions via options input', async () => {
    host.options = { title: 'Job Postings', description: 'Open roles' };
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.options()).toEqual({
      title: 'Job Postings',
      description: 'Open roles',
    });
  });
});
