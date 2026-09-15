---
title: '@smartsoft001/utils'
section: Packages
order: 3
package: '@smartsoft001/utils'
nextjs:
  metadata:
    title: '@smartsoft001/utils'
    description: 'Framework-free static helpers for identifiers, Polish document validation, arrays, objects, slugs and in-memory specification checks.'
---

A set of static helper services with no framework attached: identifiers, Polish document validation, array and object handling, slugs and in-memory specification checks. {% .lead %}

---

## Install

```bash
npm install @smartsoft001/utils
```

Everything it needs comes with it: `lodash`, `guid-typescript`, `md5`, `flatted` and `tslib` are declared as dependencies. Nothing else is required, and the package imports neither Angular nor NestJS, so it runs the same in a browser bundle, in a Node process and in a test. The specification example below also uses [`@smartsoft001/domain-core`](/docs/packages/domain-core) to build the specification it evaluates.

## What it is

This is the bottom of the internal dependency graph. Every other `@smartsoft001` package is free to depend on it, and it depends on none of them, which is why the helpers are written as static methods on classes rather than as injectable services. There is nothing to register and nothing to construct: import the class and call the method.

The contents fall into four groups. Identifier and text helpers cover GUID creation, capitalisation, HTML stripping and slug generation. Validators cover the Polish tax number, the national identity number and the postal code, each exposing a matching `isValid` and `isInvalid` so a caller can read the condition in whichever direction suits the code. Data helpers cover arrays and the conversion of plain data into class instances, which is what makes the `classType` option of `@Field` in [`@smartsoft001/models`](/docs/packages/models) work. Finally `SpecificationService` evaluates a specification against an object in memory, which is how the same business rule can be checked on the client and used as a query on the server.

Two behaviours are easy to get wrong from the signatures alone. `ArrayService.addItem` and `removeItem` return a new array, but they reach that result by mutating the array they were given first, so the argument changes too. And `PasswordService` is md5-based, which the warning below spells out.

## Usage

Identifiers are generated without a database round trip, which is what lets the client set the id of a record it is about to create.

{% snippet file="node/src/utils/guid.example.ts" region="usage" /%}

The spec asserts two properties of the result: it matches the canonical GUID layout of five hex groups, and two consecutive calls never return the same value.

Validators take the identifier as written by a person, not as stored.

{% snippet file="node/src/utils/nip.example.ts" region="usage" /%}

The spec runs one number three times. The bare ten digits pass, the same number typed with dashes passes because the service strips spaces and hyphens before weighing the digits, and a copy with the last digit altered fails the checksum. `PeselService` and `ZipCodeService` follow the same shape for the national identity number and the postal code.

A specification built for a repository can also be evaluated against an object in memory.

{% snippet file="node/src/utils/specification.example.ts" region="usage" /%}

The spec checks both directions: an account whose status matches the criteria returns `true`, an account with another status returns `false`. No repository is involved, which is the point. The rule is defined once as a value and can be used as a query on the server and as a predicate on the client.

{% callout type="note" title="Only flat criteria are evaluated" %}
`SpecificationService.valid` walks the keys of the criteria object and compares each one with the matching property of the value, treating an array property as a match when any element equals the criteria. It does not interpret the `$and` and `$or` keys that `AndSpecification` and `OrSpecification` produce, so composed specifications are for repositories. A key prefixed with `$root.` is resolved against the `custom.$root` object passed as the third argument instead of against the value.
{% /callout %}

{% callout type="warning" title="PasswordService is not a password hash" %}
`PasswordService.hash` returns an unsalted md5 digest, and `compare` simply hashes the candidate again and compares the two strings. md5 is fast and broken for this purpose, and without a salt identical passwords produce identical digests, so it must not be treated as a modern password hash. Use a memory-hard algorithm such as argon2 or bcrypt for credentials that matter, and keep this service for legacy digests you still have to read.
{% /callout %}

## API

### Identifiers and text

| Export                          | Kind          | Description                                                                                                                                                                                                                       |
| ------------------------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GuidService.create()`          | Static method | A new GUID as a lowercase hyphenated string.                                                                                                                                                                                      |
| `capitalize(val)`               | Function      | The string with its first character uppercased. Returns `''` for an empty or missing value.                                                                                                                                       |
| `RemoveHtmlService.create(val)` | Static method | Plain text from an HTML fragment. Strips tags, decodes the common named entities and the numeric `&#..;` forms, and drops any entity it does not recognise. Returns `''` for `null` or `undefined`.                               |
| `SlugService.create(text)`      | Static method | A URL slug. Strips HTML first, maps Polish diacritics onto their ASCII letters, lowercases, replaces every run of other characters with a single hyphen and trims hyphens from both ends. Returns `''` for `null` or `undefined`. |

### Validators

| Export                           | Kind          | Description                                                                                                                                      |
| -------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `NipService.isValid(nip)`        | Static method | Whether the Polish tax number passes its weighted checksum. Ignores spaces and hyphens, and answers `false` for anything that is not a string.   |
| `NipService.isInvalid(nip)`      | Static method | The negation of `isValid`.                                                                                                                       |
| `PeselService.isValid(pesel)`    | Static method | Whether the national identity number is eleven digits, carries a month no greater than 12 and a day no greater than 31, and passes its checksum. |
| `PeselService.isInvalid(pesel)`  | Static method | The negation of `isValid`.                                                                                                                       |
| `ZipCodeService.isValid(code)`   | Static method | Whether the postal code has the Polish `NN-NNN` form.                                                                                            |
| `ZipCodeService.isInvalid(code)` | Static method | The negation of `isValid`.                                                                                                                       |

### Arrays and objects

| Export                                   | Kind          | Description                                                                                                                                                                                            |
| ---------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ArrayService.addItem(array, item)`      | Static method | Pushes the item onto the array and returns a copy of the result. The argument is modified as well.                                                                                                     |
| `ArrayService.removeItem(array, item)`   | Static method | Removes the first occurrence of the item from the array and returns a copy. The argument is modified as well.                                                                                          |
| `ArrayService.sort(array, by)`           | Static method | A new array sorted by the key the callback returns, using lodash `sortBy`. Leaves the argument alone.                                                                                                  |
| `ObjectService.createByType(data, type)` | Static method | An instance of `type` carrying the own properties of `data`. Returns `data` unchanged when it is falsy or already an instance of that type. This is what rehydrates the `classType` fields of a model. |
| `ObjectService.removeTypes(obj)`         | Static method | A copy whose property values have been round-tripped through JSON, so class instances become plain objects. `Date` values are kept as they are, and a circular value falls back to `flatted`.          |

### Specifications and passwords

| Export                                               | Kind          | Description                                                                                                                                                                                                                               |
| ---------------------------------------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SpecificationService.valid(value, spec, custom?)`   | Static method | Whether the value satisfies every key of `spec.criteria`, as described in the note above. Answers `false` for a missing value.                                                                                                            |
| `SpecificationService.invalid(value, spec, custom?)` | Static method | The negation of `valid`.                                                                                                                                                                                                                  |
| `SpecificationService.getSqlCriteria(spec)`          | Static method | The criteria as a SQL `where` body, one `key = value` per criteria joined with `and`, quoting everything that is not a number. Values are interpolated as they are, with no escaping, so it must not be fed values that came from a user. |
| `SPECIFICATION_ROOT_KEY`                             | Constant      | The `'$root.'` prefix that sends a criteria key to the custom root object.                                                                                                                                                                |
| `ISpecificationCustom`                               | Interface     | The third argument of `valid` and `invalid`: an optional `$root` object.                                                                                                                                                                  |
| `PasswordService.hash(p)`                            | Static method | A promise of the unsalted md5 digest of the text. See the warning above.                                                                                                                                                                  |
| `PasswordService.compare(p, h)`                      | Static method | A promise of whether hashing the text yields exactly the given digest.                                                                                                                                                                    |

## Related packages

- [`@smartsoft001/models`](/docs/packages/models) calls the object service from its field decorator to rehydrate `classType` fields.
- [`@smartsoft001/domain-core`](/docs/packages/domain-core) builds the specifications this package evaluates.
- [`@smartsoft001/auth-domain`](/docs/packages/auth-domain) calls `PasswordService.compare` when it issues a token for the password grant, which is what the warning above is about.
- [`@smartsoft001/angular`](/docs/packages/angular) wraps the slug and HTML-stripping services as template pipes, and its form factory turns the identity and postal code validators into form validators for the matching field types.
