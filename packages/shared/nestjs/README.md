# 📦 @smartsoft001/nestjs

![npm](https://img.shields.io/npm/v/@smartsoft001/nestjs) ![downloads](https://img.shields.io/npm/dm/@smartsoft001/nestjs)

## 🚀 Usage

```bash
npm install @smartsoft001/nestjs
```

## ⚙️ Configuration

The library uses the `SharedConfig` class for authentication and permissions configuration:

### Token Configuration

| Field                            | Type     | Description                              |
| -------------------------------- | -------- | ---------------------------------------- |
| `tokenConfig.secretOrPrivateKey` | `string` | Secret or private key for signing tokens |
| `tokenConfig.expiredIn`          | `number` | Token expiration time in seconds         |

### Permissions Configuration

| Field                | Type            | Description                               |
| -------------------- | --------------- | ----------------------------------------- |
| `permissions.create` | `Array<string>` | List of permissions for create operations |
| `permissions.read`   | `Array<string>` | List of permissions for read operations   |
| `permissions.update` | `Array<string>` | List of permissions for update operations |
| `permissions.delete` | `Array<string>` | List of permissions for delete operations |
| `permissions.[key]`  | `Array<string>` | Any additional custom permissions         |

## Types

```typescript
export type PermissionType = 'create' | 'read' | 'update' | 'delete' | string;
```

# Modules

## SharedModule

The `SharedModule` is a dynamic NestJS module that provides shared configuration and services across the application. It offers two static methods for configuration: `forFeature()` and `forRoot()`.

---

### forFeature() Method

The `forFeature()` method configures the module's core functionalities:

```typescript
static forFeature(config: SharedConfig): DynamicModule
```

#### Parameters:

- `config`: An object of type `SharedConfig` containing the module's configuration.

#### Returns:

A `DynamicModule` object with the following elements:

- Providers: `SharedConfig`, `JwtStrategy`, `PermissionService`
- Exports: `SharedConfig`, `PermissionService`, `JwtStrategy`

#### Example Usage:

```typescript
import { SharedModule, SharedConfig } from '@smartsoft001/nestjs';

@Module({
  imports: [
    SharedModule.forFeature({
      tokenConfig: {
        secretOrPrivateKey: 'secret_key',
        expiredIn: 3600,
      },
      permissions: {
        create: ['admin'],
        read: ['user', 'admin'],
        update: ['admin'],
        delete: ['admin'],
      },
    }),
  ],
})
export class AppModule {}
```

---

### forRoot() Method

The `forRoot()` method extends the `forFeature()` configuration by adding database settings:

```typescript
static forRoot(config: SharedConfig & {
  db: {
    host: string;
    port: number;
    database: string;
    username?: string;
    password?: string;
  };
}): DynamicModule
```

#### Parameters:

- `config`: An extended `SharedConfig` object that includes additional database settings.

#### Returns:

A `DynamicModule` object that imports and exports the `forFeature()` configuration.

#### Example Usage:

```typescript
import { SharedModule, SharedConfig } from '@smartsoft001/nestjs';

@Module({
  imports: [
    SharedModule.forRoot({
      tokenConfig: {
        secretOrPrivateKey: 'secret_key',
        expiredIn: 3600,
      },
      permissions: {
        create: ['admin'],
        read: ['user', 'admin'],
        update: ['admin'],
        delete: ['admin'],
      },
      db: {
        host: 'localhost',
        port: 5432,
        database: 'my_database',
        username: 'user',
        password: 'password',
      },
    }),
  ],
})
export class AppModule {}
```

---

### Summary

The `SharedModule` provides flexible configuration for various use cases, enabling easy sharing of authorization, permissions, and database settings across the entire NestJS application.

# Decorators

## @User Decorator

The `@User` decorator is a custom parameter decorator in NestJS that simplifies retrieving the user object from an HTTP request.

### Functionality

The `@User` decorator performs the following actions:

- Extracts the request object (`req`) from the execution context.
- Returns the `req.user` value, which typically contains information about the authenticated user.

### Usage

The `@User` decorator can be used in NestJS controllers to easily access user data:

```typescript
import { Controller, Get } from '@nestjs/common';

import { IUser } from '@smartsoft001/users';

import { User } from './user.decorator';

@Controller('profile')
export class ProfileController {
  @Get()
  getProfile(@User() user: IUser) {
    return user;
  }
}
```

# Auth

After registering the authentication module, you can use `JwtStrategy` and `PermissionService` as follows:

---

## Using JwtStrategy

`JwtStrategy` is automatically used by `AuthGuard('jwt')`. You don't need to call it directly. Instead, use it indirectly via the `@UseGuards()` decorator:

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('secure')
@UseGuards(AuthGuard('jwt'))
export class SecureController {
  @Get()
  getSecureData() {
    return 'This is protected content';
  }
}
```

---

## Using PermissionService

`PermissionService` can be injected into controllers or services and used directly. Here are the main usage patterns:

### 1. **Injecting the Service**

```typescript
import { Injectable } from '@nestjs/common';
import { PermissionService } from './permission.service';

@Injectable()
export class SomeService {
  constructor(private permissionService: PermissionService) {}

  // ...
}
```

---

### 2. **Validating Permissions**

```typescript
import { User } from './user.decorator';

@Get('admin-panel')
adminPanel(@User() user) {
  this.permissionService.valid('admin-panel', user);
  return 'Admin Panel';
}
```

---

### 3. **Handling Errors**

```typescript
try {
  this.permissionService.valid('some-action', user);
  // Perform the protected action
} catch (error) {
  if (error instanceof DomainForbiddenError) {
    // Handle lack of permissions
  }
  throw error;
}
```

---

### 4. **Using in a Custom Guard**

```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { PermissionService } from './permission.service';

@Injectable()
export class CustomPermissionGuard implements CanActivate {
  constructor(private permissionService: PermissionService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const requiredPermission = 'some-permission';

    try {
      this.permissionService.valid(requiredPermission, user);
      return true;
    } catch (error) {
      return false;
    }
  }
}
```

---

### 5. **Checking Multiple Permissions**

```typescript
multipleChecks(@User() user) {
  this.permissionService.valid('permission1', user);
  this.permissionService.valid('permission2', user);
  // If both checks pass, perform the action
}
```

---

### Notes

- `PermissionService` throws a `DomainForbiddenError` if the required permissions are missing. Always be prepared to handle this exception or let it be caught by a global exception filter.

# Filters

## AppExceptionFilter Overview

The `AppExceptionFilter` class implements the `ExceptionFilter` interface and is used for handling exceptions in a NestJS application.

### Functionality

The filter intercepts all exceptions and processes them as follows:

- For `HttpException`, it uses the original HTTP status and message.
- For `DomainValidationError`, it sets a 400 (Bad Request) status.
- For `DomainForbiddenError`, it sets a 403 (Forbidden) status.
- For all other exceptions, it sets a 500 (Internal Server Error) status.

### Logging

The filter logs exception details (stack trace or message) using `Logger.error()`.

### Response

The filter returns an HTTP response with the appropriate status code and optionally a JSON object containing error details.

### Usage

To use this filter globally in a NestJS application, register it in the main module:

```typescript
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { AppExceptionFilter } from '@smartsoft001/nestjs';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: AppExceptionFilter,
    },
  ],
})
export class AppModule {}
```

This filter ensures consistent error handling throughout the application, mapping different exception types to appropriate HTTP status codes and formatting responses accordingly.
