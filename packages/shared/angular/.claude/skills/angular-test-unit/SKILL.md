---
name: angular-test-unit
description: Write Jest unit tests for Angular components, services and guards in @smartsoft001/angular and @smartsoft001/crud-shell-angular (TestBed, signal inputs and outputs, HttpTestingController), using the AAA pattern of the shared test-unit skill.
paths:
  - 'packages/shared/angular/**'
  - 'packages/crud/shell/angular/**'
  - 'docs/examples/angular/**'
  - 'docs/examples/app/apps/web/**'
  - 'src/**'
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
  - Glob
  - Grep
---

# Angular Unit Test Skill

The Angular part of the repository's unit test conventions. The framework-neutral rules (file location, `@smartsoft001/{package-name}: ClassName` describe blocks, AAA with blank lines and no comments, mocks, commands) are in the shared `test-unit` skill; this skill adds the TestBed patterns.

Delegate writing the specs to the `angular-jest-test-writer` agent, or to `shared-tdd-developer` when the code is written test first.

## Component Testing

### Basic Component Test

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureComponent } from './feature.component';

describe('@smartsoft001/crud-shell-angular: FeatureComponent', () => {
  let component: FeatureComponent;
  let fixture: ComponentFixture<FeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

### Testing Signal-based Components

```typescript
it('should update when signal changes', () => {
  component.count.set(5);
  fixture.detectChanges();

  expect(fixture.nativeElement.textContent).toContain('5');
});

it('should compute derived value', () => {
  component.items.set([1, 2, 3]);

  expect(component.total()).toBe(6);
});
```

### Testing Components with input()/output()

```typescript
it('should accept input value', () => {
  fixture.componentRef.setInput('value', 'test');
  fixture.detectChanges();

  expect(component.value()).toBe('test');
});

it('should emit output event', () => {
  const spy = jest.fn();
  component.changed.subscribe(spy);

  component.emitChange('new value');

  expect(spy).toHaveBeenCalledWith('new value');
});
```

## Service Testing

```typescript
import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { DataService } from './data.service';

describe('@smartsoft001/angular: DataService', () => {
  let service: DataService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(DataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch data', () => {
    const mockData = [{ id: 1, name: 'Test' }];

    service.getData().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('/api/data');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
});
```

## Observable Mocks

Services return Observables, so their mocks return `of(...)`:

```typescript
const mockService = {
  getData: jest.fn().mockReturnValue(of(mockData)),
  createItem: jest.fn().mockReturnValue(of(mockItem)),
};
```

## Commands

```bash
nx test angular
nx test crud-shell-angular
nx test angular --testFile=button.component.spec.ts
```

## Reference implementation

The Angular spec files of the example application under `docs/examples/app` use these patterns against the real framework packages.

- `docs/examples/app/apps/web/src/app/auth/login.service.spec.ts`: an Angular service on `provideHttpClient()` and `provideHttpClientTesting()`, with `HttpTestingController.verify()` in `afterEach` and the arrange, act and assert blocks separated by blank lines.
- `docs/examples/app/apps/web/src/app/auth/login.page.spec.ts`: a component driven through the DOM of the rendered `<smart-sign-in-form>`, with `LoginService` replaced by a `jest.fn()` mock and the router spied on.
- `docs/examples/app/apps/web/src/app/auth/auth.guard.spec.ts`: a functional guard run through `TestBed.runInInjectionContext` with a stubbed `AuthService`.
