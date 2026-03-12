---
name: test-unit
description: Write unit tests following project conventions. Generates Jest tests for Angular components, services, and NestJS services using AAA pattern.
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
  - Glob
  - Grep
---

# Unit Test Skill

Write unit tests following project conventions using Jest framework with AAA (Arrange-Act-Assert) pattern.

## Testing Framework

- **Framework**: Jest for all unit tests
- **File naming**: `{name}.spec.ts` alongside source files
- **Test runner**: Nx (`nx test {project}`)

## Test File Location

Place test files next to the source files they test:

```
feature/
├── feature.service.ts
├── feature.service.spec.ts
├── feature.component.ts
└── feature.component.spec.ts
```

## Naming Convention

- **Describe blocks**: `@smartsoft001/{package-name}: ClassName`
- **Test format**: `it('should...')` with clear behavior description

## Test Structure (AAA Pattern)

Always use Arrange-Act-Assert pattern with blank line separation (no comments):

```typescript
it('should perform expected operation', () => {
  const input = 'test';

  const result = service.performOperation(input);

  expect(result).toBe('expected output');
});
```

## Angular Component Testing

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

## Angular Service Testing

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

## NestJS Service Testing

```typescript
import { Test, TestingModule } from '@nestjs/testing';

import { FeatureService } from './feature.service';

describe('@smartsoft001/package-name: FeatureService', () => {
  let service: FeatureService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [FeatureService],
    }).compile();

    service = module.get<FeatureService>(FeatureService);
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
```

## Mocking Patterns

### Service Mock

```typescript
const mockService = {
  getData: jest.fn().mockReturnValue(of(mockData)),
  createItem: jest.fn().mockReturnValue(of(mockItem)),
};
```

### Test Data Factory Pattern

```typescript
export const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: 'test-id',
  login: 'testuser',
  name: 'Test',
  email: 'test@example.com',
  ...overrides,
});
```

## Test Commands

```bash
nx test <project-name>
nx test <project-name> --watch
nx test <project-name> --coverage
nx run-many --target=test
nx test <project-name> --testFile=feature.service.spec.ts
```

## Best Practices

1. **One assertion per test** when practical
2. **Descriptive test names** that explain behavior
3. **Independent tests** - no shared state between tests
4. **Mock external dependencies** - isolate unit under test
5. **Test edge cases** - empty arrays, null values, boundaries
6. **Keep tests fast** - avoid real HTTP calls or timers
