# @smartsoft001/domain-core

## Installation

`npm i @smartsoft001/domain-core`

## Repositories

### IItemRepository

**create** - Creates a new entity in the storage system.

<table>
    <thead>
        <tr>
            <td>Param</td>
            <td>Description</td>
        </tr>
    </thead>
    <tr>
        <td>item: T</td>
        <td>The entity to be created.</td>
    </tr>
    <tr>
        <td>user: IUser</td>
        <td>The user performing the operation.</td>
    </tr>
    <tr>
        <td>options?: IItemRepositoryOptions</td>
        <td>Optional parameters for the operation, including transaction context.</td>
    </tr>
</table>

returns a `Promise<void>` that resolves when the entity is successfully created.

**createMany** - Creates multiple entities in the storage system.

<table>
    <thead>
        <tr>
            <td>Param</td>
            <td>Description</td>
        </tr>
    </thead>
    <tr>
        <td>list: T[]</td>
        <td>The list of entities to be created.</td>
    </tr>
    <tr>
        <td>user: IUser</td>
        <td>The user performing the operation.</td>
    </tr>
    <tr>
        <td>options?: IItemRepositoryOptions</td>
        <td>Optional parameters for the operation, including transaction context.</td>
    </tr>
</table>

returns a `Promise<void>` that resolves when all entities are successfully created.

**update** - Updates an existing entity in the storage system.

<table>
    <thead>
        <tr>
            <td>Param</td>
            <td>Description</td>
        </tr>
    </thead>
    <tr>
        <td>item: T</td>
        <td>The entity to be updated.</td>
    </tr>
    <tr>
        <td>user: IUser</td>
        <td>The user performing the operation.</td>
    </tr>
    <tr>
        <td>options?: IItemRepositoryOptions</td>
        <td>Optional parameters for the operation, including transaction context.</td>
    </tr>
</table>

returns a `Promise<void>` that resolves when the entity is successfully updated.

**updatePartial** - Partially updates an existing entity in the storage system.

<table>
    <thead>
        <tr>
            <td>Param</td>
            <td>Description</td>
        </tr>
    </thead>
    <tr>
        <td>item:

`Partial<T>& { id: string }`

</td>
        <td>The partial entity data to be updated along with the entity's ID.</td>
    </tr>
    <tr>
        <td>user: IUser</td>
        <td>The user performing the operation.</td>
    </tr>
    <tr>
        <td>options?: IItemRepositoryOptions</td>
        <td>Optional parameters for the operation, including transaction context.</td>
    </tr>
</table>

returns a `Promise<void>` that resolves when the entity is successfully updated.

**updatePartialManyByCriteria** - Partially updates multiple entities that match the specified criteria.

<table>
    <thead>
        <tr>
            <td>Param</td>
            <td>Description</td>
        </tr>
    </thead>
    <tr>
        <td>criteria: any</td>
        <td>The criteria used to select the entities to be updated.</td>
    </tr>
    <tr>
        <td>set:

`Partial<T>`

</td>
        <td>The partial data to be set on the matching entities.</td>
    </tr>
    <tr>
        <td>user: IUser</td>
        <td>The user performing the operation.</td>
    </tr>
    <tr>
        <td>options?: IItemRepositoryOptions</td>
        <td>Optional parameters for the operation, including transaction context.</td>
    </tr>
</table>

returns a `Promise<void>` that resolves when the entities are successfully updated.

**updatePartialManyBySpecification** - Partially updates multiple entities that match the specified specification.

<table>
    <thead>
        <tr>
            <td>Param</td>
            <td>Description</td>
        </tr>
    </thead>
    <tr>
        <td>spec: ISpecification</td>
        <td>The specification used to select the entities to be updated.</td>
    </tr>
    <tr>
        <td>set:

`Partial<T>`

</td>
        <td>The partial data to be set on the matching entities.</td>
    </tr>
    <tr>
        <td>user: IUser</td>
        <td>The user performing the operation.</td>
    </tr>
    <tr>
        <td>options?: IItemRepositoryOptions</td>
        <td>Optional parameters for the operation, including transaction context.</td>
    </tr>
</table>

returns a `Promise<void>` that resolves when the entities are successfully updated.

**delete** - Deletes an entity from the storage system by its ID.

<table>
    <thead>
        <tr>
            <td>Param</td>
            <td>Description</td>
        </tr>
    </thead>
    <tr>
        <td>id: string</td>
        <td>@param {string} id - The ID of the entity to be deleted.</td>
    </tr>
    <tr>
        <td>user: IUser</td>
        <td>The user performing the operation.</td>
    </tr>
    <tr>
        <td>options?: IItemRepositoryOptions</td>
        <td>Optional parameters for the operation, including transaction context.</td>
    </tr>
</table>

returns a `Promise<void>` that resolves when the entity is successfully deleted.

**getById** - Retrieves an entity from the storage system by its ID.

<table>
    <thead>
        <tr>
            <td>Param</td>
            <td>Description</td>
        </tr>
    </thead>
    <tr>
        <td>id: string</td>
        <td>The ID of the entity to be deleted.</td>
    </tr>
    <tr>
        <td>repoOptions?: IItemRepositoryOptions</td>
        <td>Optional parameters for the operation, including transaction context.</td>
    </tr>
</table>

returns a `Promise<T>` that resolves to the retrieved entity.

**getByCriteria** - Retrieves entities from the storage system that match the specified criteria.

<table>
    <thead>
        <tr>
            <td>Param</td>
            <td>Description</td>
        </tr>
    </thead>
    <tr>
        <td>criteria: any</td>
        <td>The criteria used to select the entities.</td>
    </tr>
    <tr>
        <td>options?: any</td>
        <td>Optional parameters for the operation, such as pagination or sorting.</td>
    </tr>
</table>

returns a `Promise<{ data: T[]; totalCount: number }>` that resolves to an object containing the matching entities and the total count.

**getBySpecification** - Retrieves entities from the storage system that match the specified specification.

<table>
    <thead>
        <tr>
            <td>Param</td>
            <td>Description</td>
        </tr>
    </thead>
    <tr>
        <td>spec: ISpecification</td>
        <td>The specification used to select the entities.</td>
    </tr>
    <tr>
        <td>options?: any</td>
        <td>Optional parameters for the operation, such as pagination or sorting.</td>
    </tr>
</table>

returns a `Promise<{ data: T[]; totalCount: number }>` that resolves to an object containing the matching entities and the total count.

**countBySpecification** - Counts the number of entities in the storage system that match the specified specification.

<table>
    <thead>
        <tr>
            <td>Param</td>
            <td>Description</td>
        </tr>
    </thead>
    <tr>
        <td>spec: ISpecification</td>
        <td>The specification used to select the entities.</td>
    </tr>
</table>

returns a `Promise<number>` that resolves to a count of matching entities.

**clear** - Counts the number of entities in the storage system that match the specified specification.

<table>
    <thead>
        <tr>
            <td>Param</td>
            <td>Description</td>
        </tr>
    </thead>
    <tr>
        <td>user: IUser | IItemRepositoryOptions</td>
        <td>The user performing the operation.</td>
    </tr>
</table>

returns a `Promise<void>` that resolves when the storage system is cleared.

**changesByCriteria** - Returns an observable that emits changes to entities that match the specified criteria.

<table>
    <thead>
        <tr>
            <td>Param</td>
            <td>Description</td>
        </tr>
    </thead>
    <tr>
        <td>criteria: any</td>
        <td>The criteria used to select the entities to observe.</td>
    </tr>
</table>

returns a `Observable<any>` that emits changes to the matching entities.

### IAttachmentRepository

**upload** - Uploads a file to the storage system.

<table>
    <thead>
        <tr>
            <td>Param</td>
            <td>Description</td>
        </tr>
    </thead>
    <tr>
        <td>data: Object</td>
        <td>The data required to upload the file.</td>
    </tr>
    <tr>
        <td>data.id: string</td>
        <td>A unique identifier for the file.</td>
    </tr>
    <tr>
        <td>data.fileName: string</td>
        <td>The name of the file to be uploaded.</td>
    </tr>
    <tr>
        <td>data.stream: Stream</td>
        <td>The stream of the file to be uploaded.</td>
    </tr>
    <tr>
        <td>data.mimeType: string</td>
        <td>The MIME type of the file.</td>
    </tr>
    <tr>
        <td>data.encoding: string</td>
        <td>The encoding of the file.</td>
    </tr>
    <tr>
        <td>options?:

`{ streamCallback?: (r: any) => void }`

</td>
        <td>A callback function that gets invoked with the upload stream.</td>
    </tr>
</table>

returns a `Promise<void>` that when the upload is complete.
throws an error if the upload fails.

Example usage with MongoDB implementation:

```typescript
const repository = new MongoAttachmentRepository(config);

const fileStream = fs.createReadStream('/path/to/file');

await repository.upload(
  {
    id: 'unique-file-id',
    fileName: 'example.txt',
    stream: fileStream,
    mimeType: 'text/plain',
    encoding: 'utf-8',
  },
  {
    streamCallback: (writeStream) => {
      console.log('Upload started');
    },
  },
);

console.log('File uploaded successfully');
```

**getInfo** - Retrieves metadata information about a file stored in the storage system.

<table>
    <thead>
        <tr>
            <td>Param</td>
            <td>Description</td>
        </tr>
    </thead>
    <tr>
        <td>id: string</td>
        <td>The unique identifier of the file.</td>
    </tr>
</table>

returns a `Promise<{ fileName: string, contentType: string, length: number } | null>` that resolves to an object
containing file metadata, or `null` if the file is not found.

throws an error if retrieving the file information fails.

**getStream** - Retrieves a stream for downloading a file from the storage system.

<table>
    <thead>
        <tr>
            <td>Param</td>
            <td>Description</td>
        </tr>
    </thead>
    <tr>
        <td>id: string</td>
        <td>The unique identifier of the file.</td>
    </tr>
    <tr>
        <td>options?:

`{ start: number; end: number }`

</td>
        <td>The starting and ending byte positions for the stream.</td>
    </tr>
</table>

returns a `Promise<any>` that resolves to a readable stream of the file.

throws an error if retrieving the file stream fails.

**delete** - Deletes a file from the storage system.

<table>
    <thead>
        <tr>
            <td>Param</td>
            <td>Description</td>
        </tr>
    </thead>
    <tr>
        <td>id: string</td>
        <td>The unique identifier of the file.</td>
    </tr>
</table>

returns a `Promise<void>` that resolves when the file has been successfully deleted.

throws an error if the deletion fails.

## Unit of work

### IUnitOfWork

An abstract class that runs a set of repository calls as one atomic unit, so they either all commit or all roll back. It is implemented per storage technology; [@smartsoft001/mongo](../mongo/README.md) binds `MongoUnitOfWork` to it.

**scope** - Executes a set of operations within a transactional scope.

<table>
    <thead>
        <tr>
            <td>Param</td>
            <td>Description</td>
        </tr>
    </thead>
    <tr>
        <td>definition:

`(transaction: ITransaction) => Promise<void>`

</td>
        <td>The operations to run inside the transaction. The callback receives the transaction to pass on to every repository call it makes.</td>
    </tr>
</table>

returns a `Promise<void>` that resolves once the transaction has been committed.
throws an error if the transaction fails, in which case every operation is rolled back.

```typescript
await this.unitOfWork.scope(async (transaction) => {
  await this.itemRepository.updatePartial(
    { id: firstId, status: 'finished' },
    user,
    { transaction },
  );

  await this.itemRepository.updatePartial(
    { id: secondId, status: 'finished' },
    user,
    { transaction },
  );
});
```

### ITransaction

The context handed to a `scope` callback. It carries a single property, `connection`, whose type depends on the storage implementation, and it is what `IItemRepositoryOptions.transaction` expects.

## Specifications

A specification is an object with a `criteria` property that a repository turns into a query. `getBySpecification`, `countBySpecification` and `updatePartialManyBySpecification` all take one, and `SpecificationService` in [@smartsoft001/utils](../utils/README.md) evaluates the same object in memory.

<table>
    <thead>
        <tr>
            <td>Class</td>
            <td>Description</td>
        </tr>
    </thead>
    <tr>
        <td>BasicSpecification</td>
        <td>Holds one criteria object. The base class the other three extend, and the one to extend for a specification of your own.</td>
    </tr>
    <tr>
        <td>MergeSpecification</td>
        <td>Shallow merges the criteria of every specification it is given into one object. A later specification overwrites an earlier one on the same key.</td>
    </tr>
    <tr>
        <td>AndSpecification</td>
        <td>Combines the given specifications under `$and`, matching entities that satisfy all of them.</td>
    </tr>
    <tr>
        <td>OrSpecification</td>
        <td>Combines the given specifications under `$or`, matching entities that satisfy at least one of them.</td>
    </tr>
</table>

```typescript
const spec = new AndSpecification(
  new BasicSpecification({ status: 'finished' }),
  new OrSpecification(
    new BasicSpecification({ owner: 'ann' }),
    new BasicSpecification({ owner: 'bob' }),
  ),
);

const { data, totalCount } = await repository.getBySpecification(spec);
```

`ISpecification`, the interface all four implement, is re-exported here from [@smartsoft001/models](../models/README.md) so that the domain layer can be written against this package alone.

## Errors

Two error classes the domain layer throws and the HTTP layer maps to status codes. Each one carries a `type` property holding its own constructor, which is how a filter recognises it after the class has crossed a package boundary.

<table>
    <thead>
        <tr>
            <td>Class</td>
            <td>Description</td>
        </tr>
    </thead>
    <tr>
        <td>DomainValidationError</td>
        <td>The request was understood but the data is not acceptable. The NestJS filter in [@smartsoft001/nestjs](../nestjs/README.md) answers 400.</td>
    </tr>
    <tr>
        <td>DomainForbiddenError</td>
        <td>The acting user is not allowed to perform the operation. The same filter answers 403.</td>
    </tr>
</table>

## Interfaces

<table>
    <thead>
        <tr>
            <td>Interface</td>
            <td>Description</td>
        </tr>
    </thead>
    <tr>
        <td>IEntity&lt;T&gt;</td>
        <td>Anything the repositories store: a single `id` of type `T`.</td>
    </tr>
    <tr>
        <td>IAddress</td>
        <td>City, street, building number, optional flat number and zip code.</td>
    </tr>
    <tr>
        <td>IDateRange</td>
        <td>A `start` and an `end`, both `YYYY-MM-DD` strings.</td>
    </tr>
    <tr>
        <td>IFactory&lt;T, TConfig&gt;</td>
        <td>`create(config)` returning a `Promise<T>`, the contract a factory service implements.</td>
    </tr>
    <tr>
        <td>IItemRepositoryOptions</td>
        <td>The last argument of every repository method: a `transaction` from the unit of work.</td>
    </tr>
</table>
