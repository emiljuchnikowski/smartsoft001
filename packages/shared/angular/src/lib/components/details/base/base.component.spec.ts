import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IEntity } from '@smartsoft001/domain-core';
import { Field, Model } from '@smartsoft001/models';

import { DetailsBaseComponent } from './base.component';
import { IDetailsOptions } from '../../../models';

@Model({})
class TestItemModel implements IEntity<string> {
  id = 'test-id';

  @Field({ details: true })
  name = 'Test name';
}

@Component({
  selector: 'smart-test-details',
  template: '',
})
class TestDetailsComponent extends DetailsBaseComponent<TestItemModel> {}

@Component({
  selector: 'smart-test-host',
  template: `<smart-test-details [options]="options" [class]="cssClass" />`,
  imports: [TestDetailsComponent],
})
class TestHostComponent {
  options: IDetailsOptions<TestItemModel> = {
    type: TestItemModel,
    item: signal(new TestItemModel()),
  };
  cssClass = '';
}

describe('@smartsoft001/shared-angular: DetailsBaseComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let details: TestDetailsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    details = fixture.debugElement.children[0].componentInstance;
  });

  it('should create an instance when extended', () => {
    expect(details).toBeInstanceOf(DetailsBaseComponent);
  });

  it('should default cssClass to empty string', () => {
    expect(details.cssClass()).toBe('');
  });

  it('should accept cssClass via class alias', async () => {
    fixture.componentInstance.cssClass = 'my-custom-class';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(details.cssClass()).toBe('my-custom-class');
  });
});
