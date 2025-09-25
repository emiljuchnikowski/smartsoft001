# crud-shell-angular

This library provides a generic CRUD (Create, Read, Update, Delete) solution for Angular applications using NgRx Signals.

## Features

- Generic CRUD operations for any entity type
- NgRx Signals-based state management
- Configurable and extensible store architecture
- Multi-module support with isolated stores
- TypeScript support with full type safety

## Basic Usage

### 1. Import CrudModule in your feature module

```typescript
import { CrudModule } from '@smartsoft001/crud-shell-angular';

@NgModule({
  imports: [
    CrudModule.forFeature<User>({
      routing: false,
      config: {
        apiUrl: '/api/users',
        entity: 'users'
      }
    })
  ]
})
export class UserModule {}
```

### 2. Inject CrudFacade in your component

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrudFacade } from '@smartsoft001/crud-shell-angular';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (facade.loading()) {
      <div>Loading...</div>
    } @else {
      @for (item of facade.list(); track item.id) {
        <div>{{ item.name }}</div>
      }
    }
  `
})
export class UserListComponent implements OnInit {
  facade = inject(CrudFacade<User>);

  ngOnInit() {
    this.facade.read();
  }
}
```

## Extending the Store

### Method 1: Extending CrudFacade

Create a custom facade that extends the base CrudFacade:

```typescript
import { Injectable } from '@angular/core';
import { CrudFacade } from '@smartsoft001/crud-shell-angular';

@Injectable()
export class UserFacade extends CrudFacade<User> {

  // Add custom methods
  activateUser(id: string): void {
    this.updatePartial({ id, active: true });
  }

  deactivateUser(id: string): void {
    this.updatePartial({ id, active: false });
  }

  // Override existing methods
  create(item: User): void {
    const processedUser = {
      ...item,
      createdAt: new Date(),
      active: true
    };
    super.create(processedUser);
  }
}
```

### Method 2: Custom Store Provider

Create a custom store provider for advanced scenarios:

```typescript
import { Injectable } from '@angular/core';
import { CrudStoreProvider } from '@smartsoft001/crud-shell-angular';

@Injectable()
export class UserStoreProvider extends CrudStoreProvider<User> {

  protected createStore() {
    // Create store with custom configuration
    return createCrudFeatureStore<User>({
      storeName: 'advanced-users',
      providedIn: undefined // module-scoped
    });
  }
}

// In your module
@NgModule({
  providers: [
    { provide: CrudStoreProvider, useClass: UserStoreProvider },
    // ... other providers
  ]
})
export class UserModule {}
```

### Method 3: Store Configuration

Configure store options through CrudConfig:

```typescript
CrudModule.forFeature<User>({
  routing: false,
  config: {
    apiUrl: '/api/users',
    entity: 'users',
    storeOptions: {
      storeName: 'custom-user-store',
      providedIn: UserModule // module-scoped store
    }
  }
})
```

## Multi-Module Support

Each module using CrudModule creates its own isolated store instance:

```typescript
// UserModule
CrudModule.forFeature<User>({
  config: { apiUrl: '/api/users', entity: 'users' }
})

// ProductModule
CrudModule.forFeature<Product>({
  config: { apiUrl: '/api/products', entity: 'products' }
})
```

Both modules will have separate stores that don't interfere with each other.

## Available Facade Methods

### State Signals
- `loaded: Signal<boolean>` - Whether data has been loaded
- `loading: Signal<boolean>` - Whether data is currently loading
- `selected: Signal<T | undefined>` - Currently selected item
- `list: Signal<T[] | undefined>` - List of items
- `error: Signal<any>` - Last error that occurred

### CRUD Operations
- `create(item: T): void` - Create new item
- `read(filter?: ICrudFilter): void` - Read/refresh data
- `update(item: T): void` - Update existing item
- `delete(id: string): void` - Delete item by ID
- `select(id: string): void` - Select item by ID
- `clear(): void` - Clear all data

## Store Architecture

The store architecture consists of:

1. **CrudFacade** - Main service for components to interact with
2. **CrudStoreProvider** - Injectable provider that creates the store
3. **CrudFeatureStore** - NgRx Signals store with CRUD state and methods
4. **CrudConfig** - Configuration object with API settings and store options

## Running unit tests

Run `nx test crud-shell-angular` to execute the unit tests.
