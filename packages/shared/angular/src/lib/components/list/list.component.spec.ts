import { Component, input, Pipe, PipeTransform, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslatePipe } from '@ngx-translate/core';

import { IEntity } from '@smartsoft001/domain-core';
import { Field, Model } from '@smartsoft001/models';

import { ListComponent } from './list.component';
import { IListOptions, IListProvider, ListMode } from '../../models';
import { HardwareService } from '../../services';
import { LIST_MODE_COMPONENTS_TOKEN } from '../../shared.inectors';

@Pipe({ name: 'translate', standalone: true })
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

@Component({
  selector: 'smart-list-desktop-mock',
  template: '<div class="mock-desktop">desktop</div>',
})
class MockDesktopComponent {
  options = input<unknown>();
  cssClass = input<string>('', { alias: 'class' });
}

@Component({
  selector: 'smart-list-mobile-mock',
  template: '<div class="mock-mobile">mobile</div>',
})
class MockMobileComponent {
  options = input<unknown>();
  cssClass = input<string>('', { alias: 'class' });
}

@Component({
  selector: 'smart-list-masonry-mock',
  template: '<div class="mock-masonry">masonry</div>',
})
class MockMasonryComponent {
  options = input<unknown>();
  cssClass = input<string>('', { alias: 'class' });
}

@Component({
  selector: 'smart-list-custom-mock',
  template: '<div class="mock-custom">custom</div>',
})
class MockCustomComponent {
  options = input<unknown>();
  cssClass = input<string>('', { alias: 'class' });
}

@Model({})
class TestItemModel implements IEntity<string> {
  id = 'test-id';

  @Field({ list: true })
  firstName = 'Jane';
}

function createProvider(): IListProvider<TestItemModel> {
  return {
    list: signal<TestItemModel[]>([]),
    loading: signal(false),
    getData: jest.fn(),
  } as unknown as IListProvider<TestItemModel>;
}

const buildOptions = (mode?: ListMode): IListOptions<TestItemModel> => ({
  provider: createProvider(),
  type: TestItemModel,
  mode,
});

const baseMockMap = {
  [ListMode.desktop]: MockDesktopComponent,
  [ListMode.mobile]: MockMobileComponent,
  [ListMode.masonryGrid]: MockMasonryComponent,
};

async function prepareTestBed(
  isMobile: boolean,
  tokenMap: Record<string, unknown> = baseMockMap,
) {
  await TestBed.configureTestingModule({
    imports: [ListComponent],
    providers: [
      { provide: HardwareService, useValue: { isMobile } },
      { provide: LIST_MODE_COMPONENTS_TOKEN, useValue: tokenMap },
    ],
  })
    .overrideComponent(ListComponent, {
      remove: { imports: [TranslatePipe] },
      add: { imports: [MockTranslatePipe] },
    })
    .compileComponents();
}

describe('@smartsoft001/shared-angular: ListComponent', () => {
  describe('mode dispatch via base mock map', () => {
    let fixture: ComponentFixture<ListComponent<TestItemModel>>;

    it('should render desktop mock when hardwareService.isMobile is false', async () => {
      await prepareTestBed(false);
      fixture = TestBed.createComponent(ListComponent<TestItemModel>);
      fixture.componentRef.setInput('options', buildOptions());
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.mock-desktop')).toBeTruthy();
      expect(fixture.nativeElement.querySelector('.mock-mobile')).toBeFalsy();
    });

    it('should render mobile mock when hardwareService.isMobile is true', async () => {
      await prepareTestBed(true);
      fixture = TestBed.createComponent(ListComponent<TestItemModel>);
      fixture.componentRef.setInput('options', buildOptions());
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.mock-mobile')).toBeTruthy();
      expect(fixture.nativeElement.querySelector('.mock-desktop')).toBeFalsy();
    });

    it('should render component for options.mode when set', async () => {
      await prepareTestBed(false);
      fixture = TestBed.createComponent(ListComponent<TestItemModel>);
      fixture.componentRef.setInput(
        'options',
        buildOptions(ListMode.masonryGrid),
      );
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.mock-masonry')).toBeTruthy();
    });
  });

  describe('with LIST_MODE_COMPONENTS_TOKEN override', () => {
    it('should render the injected custom component for a mode override', async () => {
      await prepareTestBed(false, {
        ...baseMockMap,
        [ListMode.desktop]: MockCustomComponent,
      });
      const fixture = TestBed.createComponent(ListComponent<TestItemModel>);
      fixture.componentRef.setInput('options', buildOptions());
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.mock-custom')).toBeTruthy();
      expect(fixture.nativeElement.querySelector('.mock-desktop')).toBeFalsy();
    });
  });

  describe('componentInputs and cssClass', () => {
    let fixture: ComponentFixture<ListComponent<TestItemModel>>;
    let component: ListComponent<TestItemModel>;

    beforeEach(async () => {
      await prepareTestBed(false);
      fixture = TestBed.createComponent(ListComponent<TestItemModel>);
      component = fixture.componentInstance;
    });

    it('should expose componentInputs with options and class', () => {
      fixture.componentRef.setInput('options', buildOptions());
      fixture.componentRef.setInput('class', 'my-class');
      fixture.detectChanges();

      const inputs = component.componentInputs();

      expect(inputs.class).toBe('my-class');
      expect(inputs.options).toBeTruthy();
    });

    it('should default cssClass to empty string', () => {
      fixture.componentRef.setInput('options', buildOptions());
      fixture.detectChanges();

      expect(component.cssClass()).toBe('');
    });
  });
});
