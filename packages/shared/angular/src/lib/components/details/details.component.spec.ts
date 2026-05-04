import { Component, input, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IEntity } from '@smartsoft001/domain-core';
import { Field, Model } from '@smartsoft001/models';

import { DetailsBaseComponent } from './base/base.component';
import { DetailsComponent } from './details.component';
import { DetailComponent } from '../detail';
import { DetailsStandardComponent } from './standard/standard.component';
import { IDetailsOptions } from '../../models';
import { DETAILS_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-detail',
  template: '<span class="mock-detail">mock</span>',
})
class MockDetailComponent {
  options = input<unknown>();
  type = input<unknown>();
}

@Model({})
class TestItemModel implements IEntity<string> {
  id = 'test-id';

  @Field({ details: true })
  name = 'Test name';
}

@Component({
  selector: 'smart-test-custom-details',
  template: '<div class="custom-details">custom</div>',
})
class TestCustomDetailsComponent extends DetailsBaseComponent<TestItemModel> {
  // NgComponentOutlet passes 'cssClass' (not aliased 'class') so declare it explicitly
  override cssClass = input<string>('');
}

const buildOptions = (): IDetailsOptions<TestItemModel> => ({
  type: TestItemModel,
  item: signal(new TestItemModel()),
});

describe('@smartsoft001/shared-angular: DetailsComponent', () => {
  describe('without token', () => {
    let fixture: ComponentFixture<DetailsComponent<TestItemModel>>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [DetailsComponent],
      })
        .overrideComponent(DetailsStandardComponent, {
          remove: { imports: [DetailComponent] },
          add: { imports: [MockDetailComponent] },
        })
        .compileComponents();

      fixture = TestBed.createComponent(DetailsComponent<TestItemModel>);
      fixture.componentRef.setInput('options', buildOptions());
      fixture.detectChanges();
    });

    it('should render smart-details-standard by default (no token provided)', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-details-standard',
      );

      expect(standard).toBeTruthy();
    });
  });

  describe('with DETAILS_STANDARD_COMPONENT_TOKEN', () => {
    let fixture: ComponentFixture<DetailsComponent<TestItemModel>>;
    let component: DetailsComponent<TestItemModel>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [DetailsComponent, TestCustomDetailsComponent],
        providers: [
          {
            provide: DETAILS_STANDARD_COMPONENT_TOKEN,
            useValue: TestCustomDetailsComponent,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(DetailsComponent<TestItemModel>);
      component = fixture.componentInstance;
      fixture.componentRef.setInput('options', buildOptions());
      fixture.detectChanges();
    });

    it('should render injected component when DETAILS_STANDARD_COMPONENT_TOKEN is provided', () => {
      const injected = fixture.nativeElement.querySelector('.custom-details');

      expect(injected).toBeTruthy();
    });

    it('should expose componentInputs with options and cssClass', () => {
      const opts = buildOptions();
      fixture.componentRef.setInput('options', opts);
      fixture.componentRef.setInput('class', 'my-custom-class');
      fixture.detectChanges();

      const inputs = component.componentInputs();

      expect(inputs['options']).toEqual(opts);
      expect(inputs['class']).toBe('my-custom-class');
    });
  });
});
