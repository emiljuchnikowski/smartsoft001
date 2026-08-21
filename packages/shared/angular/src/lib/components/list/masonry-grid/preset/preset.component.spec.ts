import { Component, Pipe, PipeTransform, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { IEntity } from '@smartsoft001/domain-core';
import { Field, FieldType, Model } from '@smartsoft001/models';

import { ListMasonryGridPresetComponent } from './preset.component';
import { IListInternalOptions, IListProvider } from '../../../../models';
import { FileUrlPipe, ListCellPipe } from '../../../../pipes';
import { AlertService, AuthService } from '../../../../services';
import { PagingComponent } from '../../../paging';

@Pipe({ name: 'smartListCell' })
class MockListCellPipe implements PipeTransform {
  transform(_obj: unknown, key: string): { value: string; type: string } {
    if (key === 'photo') return { value: 'file-id', type: FieldType.image };
    return { value: `value-${key}`, type: 'text' };
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

  @Field({ list: true, type: FieldType.image })
  photo = 'file-id';

  @Field({ list: true })
  firstName = 'Jane';

  @Field({ list: true })
  lastName = 'Doe';
}

function createProvider(
  data: TestItemModel[] = [],
): IListProvider<TestItemModel> {
  return {
    list: signal<TestItemModel[]>(data),
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

const FIELDS = [
  { key: 'photo', options: { list: true, type: FieldType.image } },
  { key: 'firstName', options: { list: true } },
  { key: 'lastName', options: { list: true } },
];

@Component({
  selector: 'smart-test-host',
  template: `<smart-list-masonry-grid-preset
    [options]="options"
    [class]="cssClass"
  ></smart-list-masonry-grid-preset>`,
  imports: [ListMasonryGridPresetComponent],
})
class TestHostComponent {
  options: IListInternalOptions<TestItemModel> = {
    provider: createProvider([]),
    type: TestItemModel,
    fields: FIELDS,
  } as unknown as IListInternalOptions<TestItemModel>;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: ListMasonryGridPresetComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let preset: ListMasonryGridPresetComponent<TestItemModel>;

  async function setup(items: TestItemModel[] = [], cssClass = '') {
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
            get: (k: string) => ({
              subscribe: (fn: (v: string) => void) => {
                fn(k);
                return { unsubscribe: () => undefined };
              },
            }),
            onTranslationChange: {
              subscribe: () => ({ unsubscribe: () => undefined }),
            },
            onLangChange: {
              subscribe: () => ({ unsubscribe: () => undefined }),
            },
            onDefaultLangChange: {
              subscribe: () => ({ unsubscribe: () => undefined }),
            },
            onFallbackLangChange: {
              subscribe: () => ({ unsubscribe: () => undefined }),
            },
          },
        },
      ],
    })
      .overrideComponent(ListMasonryGridPresetComponent, {
        remove: {
          imports: [PagingComponent, ListCellPipe, FileUrlPipe],
        },
        add: {
          imports: [MockPagingComponent, MockListCellPipe, MockFileUrlPipe],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.options = {
      provider: createProvider(items),
      type: TestItemModel,
      fields: FIELDS,
    } as unknown as IListInternalOptions<TestItemModel>;
    fixture.componentInstance.cssClass = cssClass;
    fixture.detectChanges();
    preset = fixture.debugElement.children[0].componentInstance;
  }

  function makeItems(count: number): TestItemModel[] {
    return Array.from({ length: count }, (_, i) =>
      Object.assign(new TestItemModel(), { id: `id-${i}` }),
    );
  }

  it('should keep the base masonry column layout on the grid container', async () => {
    await setup(makeItems(1));

    const grid = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="grid"]',
    );

    expect(grid).toBeTruthy();
    expect(grid?.className).toContain('smart:grid');
    expect(grid?.className).toContain('smart:sm:grid-cols-2');
    expect(grid?.className).toContain('smart:lg:grid-cols-3');
  });

  it('should render one card per item', async () => {
    await setup(makeItems(3));

    const cards = (fixture.nativeElement as HTMLElement).querySelectorAll(
      '[data-role="card"]',
    );

    expect(cards.length).toBe(3);
  });

  it('should apply preset card container classes to each card', async () => {
    await setup(makeItems(1));

    const card = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="card"]',
    );

    expect(card?.className).toContain('smart:rounded-xl');
    expect(card?.className).toContain('smart:border');
    expect(card?.className).toContain('smart:bg-white');
    expect(card?.className).toContain('smart:dark:bg-gray-800');
  });

  it('should render the item image with a rounded card top', async () => {
    await setup(makeItems(1));

    const image = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="card-image"]',
    );

    expect(image).toBeTruthy();
    expect(image?.className).toContain('smart:rounded-t-xl');
    expect(image?.className).toContain('smart:object-cover');
  });

  it('should map the first non-image cell to the card title and the rest to text', async () => {
    await setup(makeItems(1));

    const titles = (fixture.nativeElement as HTMLElement).querySelectorAll(
      '[data-role="card-title"]',
    );
    const texts = (fixture.nativeElement as HTMLElement).querySelectorAll(
      '[data-role="card-text"]',
    );

    expect(titles.length).toBe(1);
    expect(titles[0].innerHTML).toContain('value-firstName');
    expect(texts.length).toBe(1);
    expect(texts[0].innerHTML).toContain('value-lastName');
  });

  it('should append the class alias input to the grid container', async () => {
    await setup(makeItems(1), 'my-extra-class');

    const grid = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="grid"]',
    );

    expect(preset.cssClass()).toBe('my-extra-class');
    expect(grid?.className).toContain('my-extra-class');
  });

  it('should render no cards when the list is empty', async () => {
    await setup([]);

    const cards = (fixture.nativeElement as HTMLElement).querySelectorAll(
      '[data-role="card"]',
    );

    expect(cards.length).toBe(0);
  });
});
