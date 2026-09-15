import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudFacade } from '@smartsoft001/crud-shell-angular';

import { Note } from './crud-config.example';
import { NotesListComponent } from './crud-facade.example';

describe('docs-examples-angular: NotesListComponent', () => {
  let fixture: ComponentFixture<NotesListComponent>;
  let facadeMock: {
    list: ReturnType<typeof signal<Note[] | undefined>>;
    loading: ReturnType<typeof signal<boolean>>;
    read: jest.Mock;
  };

  beforeEach(async () => {
    facadeMock = {
      list: signal<Note[] | undefined>([
        { id: '1', title: 'Shopping', content: 'Milk' },
        { id: '2', title: 'Ideas', content: 'Write docs' },
      ]),
      loading: signal(false),
      read: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [NotesListComponent],
      providers: [{ provide: CrudFacade, useValue: facadeMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(NotesListComponent);
    fixture.detectChanges();
  });

  it('should load the collection once on init', () => {
    expect(facadeMock.read).toHaveBeenCalledTimes(1);
  });

  it('should read with an empty filter', () => {
    expect(facadeMock.read).toHaveBeenCalledWith({});
  });

  it('should render one row per item in the facade list', () => {
    const rows = fixture.nativeElement.querySelectorAll('li');

    expect(rows).toHaveLength(2);
  });

  it('should render the title of each item', () => {
    const rows: HTMLLIElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('li'),
    );

    expect(rows.map((row) => row.textContent?.trim())).toEqual([
      'Shopping',
      'Ideas',
    ]);
  });

  it('should render a loading message while the facade is loading', () => {
    facadeMock.loading.set(true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('p').textContent).toContain(
      'Loading',
    );
  });

  it('should render no rows when the facade list is still undefined', () => {
    facadeMock.list.set(undefined);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('li')).toHaveLength(0);
  });
});
