import { Component, input, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IEntity } from '@smartsoft001/domain-core';
import { Field, Model } from '@smartsoft001/models';

import { DetailsStandardComponent } from './standard.component';
import { IDetailsOptions } from '../../../models';
import { DetailComponent } from '../../detail';

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

  @Field({ details: true })
  email = 'test@example.com';
}

@Component({
  selector: 'smart-test-host',
  template: `<smart-details-standard
    [options]="options"
    [class]="cssClass"
  ></smart-details-standard>`,
  imports: [DetailsStandardComponent],
})
class TestHostComponent {
  options: IDetailsOptions<TestItemModel> = {
    type: TestItemModel,
    item: signal(new TestItemModel()),
  };
  cssClass = '';
}

describe('@smartsoft001/shared-angular: DetailsStandardComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let standard: DetailsStandardComponent<TestItemModel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    })
      .overrideComponent(DetailsStandardComponent, {
        remove: { imports: [DetailComponent] },
        add: { imports: [MockDetailComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    standard = fixture.debugElement.children[0].componentInstance;
  });

  it('should render a <dl> container with divider classes', () => {
    const dl = fixture.nativeElement.querySelector('dl');

    expect(dl).toBeTruthy();
    expect(dl.className).toContain('smart:divide-y');
    expect(dl.className).toContain('dark:smart:divide-white/10');
  });

  it('should apply container border + dark mode classes on the wrapper', () => {
    const classes = standard.containerClasses();

    expect(classes).toContain('smart:border-t');
    expect(classes).toContain('smart:border-gray-100');
    expect(classes).toContain('dark:smart:border-white/10');
  });

  it('should append cssClass to the container', async () => {
    fixture.componentInstance.cssClass = 'my-extra-class';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(standard.containerClasses()).toContain('my-extra-class');
  });

  it('should render one <smart-detail> per field', () => {
    const details = fixture.nativeElement.querySelectorAll('smart-detail');

    expect(details.length).toBe(2);
  });
});
