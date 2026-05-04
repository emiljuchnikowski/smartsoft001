import { Component, Pipe, PipeTransform, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { IEntity } from '@smartsoft001/domain-core';
import { Field, Model } from '@smartsoft001/models';

import { ListDesktopComponent } from './desktop.component';
import { IListInternalOptions, IListProvider } from '../../../models';
import { FileUrlPipe, ListCellPipe, ListHeaderPipe } from '../../../pipes';
import { AlertService, AuthService } from '../../../services';
import { PagingComponent } from '../../paging';

@Pipe({ name: 'smartListHeader' })
class MockListHeaderPipe implements PipeTransform {
  transform(): () => string {
    return () => '';
  }
}

@Pipe({ name: 'smartListCell' })
class MockListCellPipe implements PipeTransform {
  transform(): null {
    return null;
  }
}

@Pipe({ name: 'smartFileUrl' })
class MockFileUrlPipe implements PipeTransform {
  transform(v: unknown): unknown {
    return v;
  }
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

@Component({
  selector: 'smart-paging',
  template: '',
})
class MockPagingComponent {
  currentPage: number | undefined;
  totalPages: number | undefined;
}

@Component({
  selector: 'smart-test-host',
  template: `<smart-list-desktop
    [options]="options"
    [class]="cssClass"
  ></smart-list-desktop>`,
  imports: [ListDesktopComponent],
})
class TestHostComponent {
  options: IListInternalOptions<TestItemModel> = {
    provider: createProvider(),
    type: TestItemModel,
    fields: [{ key: 'firstName', options: { list: true } }],
  };
  cssClass = '';
}

describe('@smartsoft001/shared-angular: ListDesktopComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let desktop: ListDesktopComponent<TestItemModel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: { expectPermissions: () => true } },
        { provide: AlertService, useValue: { show: jest.fn() } },
        {
          provide: TranslateService,
          useValue: {
            instant: (k: string) => k,
            get: () => ({
              subscribe: () => ({ unsubscribe: () => undefined }),
            }),
          },
        },
      ],
    })
      .overrideComponent(ListDesktopComponent, {
        remove: {
          imports: [PagingComponent, ListHeaderPipe, ListCellPipe, FileUrlPipe],
        },
        add: {
          imports: [
            MockPagingComponent,
            MockListHeaderPipe,
            MockListCellPipe,
            MockFileUrlPipe,
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    desktop = fixture.debugElement.children[0].componentInstance;
  });

  it('should render a <table> with Tailwind container classes', () => {
    const table = fixture.nativeElement.querySelector('table');

    expect(table).toBeTruthy();
    expect(table.className).toContain('smart:divide-y');
    expect(table.className).toContain('smart:dark:divide-white/10');
  });

  it('should include base container classes in containerClasses()', () => {
    const classes = desktop.containerClasses();

    expect(classes).toContain('smart:min-w-full');
    expect(classes).toContain('smart:divide-y');
    expect(classes).toContain('smart:dark:divide-white/10');
  });

  it('should append cssClass to containerClasses when provided', async () => {
    fixture.componentInstance.cssClass = 'my-extra-class';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(desktop.containerClasses()).toContain('my-extra-class');
  });

  it('should order desktopKeys: keys + removeAction + itemAction', () => {
    desktop.keys = ['firstName'];
    desktop.removeHandler = () => undefined;
    desktop.itemHandler = () => undefined;

    expect(desktop.desktopKeys).toEqual([
      'firstName',
      'removeAction',
      'itemAction',
    ]);
  });
});
