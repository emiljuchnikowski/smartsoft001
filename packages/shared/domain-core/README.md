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

await repository.upload({
  id: 'unique-file-id',
  fileName: 'example.txt',
  stream: fileStream,
  mimeType: 'text/plain',
  encoding: 'utf-8'
}, {
  streamCallback: (writeStream) => {
    console.log('Upload started');
  }
});

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
