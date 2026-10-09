---
name: test-unit
description: Write unit tests following project conventions. Jest with the AAA pattern, describe-block naming, mocks and test commands for every package, with NestJS service tests; the UI libraries add their own component-testing skill.
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
- **File naming**: `{name}.spec.ts` (`{name}.spec.tsx` when the spec renders JSX) alongside source files
- **Test runner**: Nx (`nx test {project}`)

## Framework-specific tests

Component and service tests of a UI library follow that library's own testing skill, which lives in the library's `.claude/skills/` and loads once you work on its files; the library's `CLAUDE.md` names it. This skill covers what every package shares.

## Test File Location

Place test files next to the source files they test:

```
feature/
├── feature.service.ts
└── feature.service.spec.ts
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
  getData: jest.fn().mockResolvedValue(mockData),
  createItem: jest.fn().mockResolvedValue(mockItem),
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

## Reference implementation

The spec files of the example application under `docs/examples/app` are AAA tests against the real framework packages.

- `docs/examples/app/apps/api/src/app/users.seed.spec.ts`: a NestJS provider constructed by hand with a repository mock, no `TestingModule` needed.
- `docs/examples/app/apps/api/src/config.spec.ts`: a pure function asserted against its documented defaults and each override.
- `docs/examples/app/libs/model/src/lib/note.model.spec.ts`: model metadata asserted through the `@smartsoft001/models` helpers, with the project name as the describe prefix because the app is not a package.
