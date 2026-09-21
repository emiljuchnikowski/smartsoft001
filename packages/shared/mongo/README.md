# 📦 @smartsoft001/mongo

![npm](https://img.shields.io/npm/v/@smartsoft001/mongo) ![downloads](https://img.shields.io/npm/dm/@smartsoft001/mongo)

The MongoDB implementation of the storage contracts declared in [@smartsoft001/domain-core](../domain-core/README.md). One module import binds the abstract repositories and the unit of work to classes backed by the MongoDB driver, so application code keeps injecting the abstractions and never names a driver type.

## 🚀 Usage

`npm i @smartsoft001/mongo`

```typescript
import { Module } from '@nestjs/common';
import { MongoModule } from '@smartsoft001/mongo';

@Module({
  imports: [
    MongoModule.forRoot({
      host: 'localhost',
      port: 27017,
      database: 'app',
      collection: 'tasks',
    }),
  ],
})
export class DataModule {}
```

`forRoot` only builds a provider list. Every repository method opens its own connection when it runs and closes it when it finishes, so importing the module reaches no database and a module that imports it can be compiled and inspected offline. There is no `forFeature`: a second database or a second collection means a second `forRoot` in the module that needs it.

## 🔌 What forRoot registers

The dynamic module both provides and exports four bindings, so importing it is enough to inject any of them.

<table>
    <thead>
        <tr>
            <td>Token</td>
            <td>Bound to</td>
        </tr>
    </thead>
    <tr>
        <td>MongoConfig</td>
        <td>the object you passed in, as a value provider</td>
    </tr>
    <tr>
        <td>IItemRepository</td>
        <td>MongoItemRepository</td>
    </tr>
    <tr>
        <td>IAttachmentRepository</td>
        <td>MongoAttachmentRepository</td>
    </tr>
    <tr>
        <td>IUnitOfWork</td>
        <td>MongoUnitOfWork</td>
    </tr>
</table>

## ⚙️ MongoConfig

A plain class used both as the shape of the argument and as the injection token.

<table>
    <thead>
        <tr>
            <td>Field</td>
            <td>Required</td>
            <td>Description</td>
        </tr>
    </thead>
    <tr>
        <td>database: string</td>
        <td>yes</td>
        <td>The database name, also sent as the authSource of the connection string.</td>
    </tr>
    <tr>
        <td>host: string</td>
        <td>no</td>
        <td>The server host. A host ending in ondigitalocean.com switches the connection to mongodb+srv with TLS.</td>
    </tr>
    <tr>
        <td>port: number</td>
        <td>no</td>
        <td>The server port.</td>
    </tr>
    <tr>
        <td>username: string</td>
        <td>no</td>
        <td>Supplied together with password, adds credentials to the connection string.</td>
    </tr>
    <tr>
        <td>password: string</td>
        <td>no</td>
        <td>The password for username.</td>
    </tr>
    <tr>
        <td>collection: string</td>
        <td>no</td>
        <td>The collection the item repository works on, and the GridFS bucket name the attachment repository uses.</td>
    </tr>
    <tr>
        <td>type: any</td>
        <td>no</td>
        <td>The model class of the stored entity. Its @Field metadata is read to expand a $search criterion into a case insensitive regex query.</td>
    </tr>
    <tr>
        <td>url: string</td>
        <td>no</td>
        <td>Declared but not read: the connection string is always built from host, port, the credentials and database.</td>
    </tr>
</table>

## 🛠️ Services & Methods

### MongoItemRepository

Implements `IItemRepository<T>`. Inject it through the `IItemRepository` token. It maps `id` to MongoDB's `_id` on the way in and back again on the way out, and records the acting user and a timestamp under a hidden `__info` field that is stripped from everything it returns.

Methods:

<table>
    <tr>
        <td>create</td>
        <td>Inserts one document, stamping the acting user and the date</td>
    </tr>
    <tr>
        <td>createMany</td>
        <td>Inserts many documents in one call</td>
    </tr>
    <tr>
        <td>update</td>
        <td>Replaces the whole document, keeping the creation record</td>
    </tr>
    <tr>
        <td>updatePartial</td>
        <td>Sets only the fields present on the given object</td>
    </tr>
    <tr>
        <td>updatePartialManyByCriteria</td>
        <td>Applies one partial update to every document matching a raw criteria object</td>
    </tr>
    <tr>
        <td>updatePartialManyBySpecification</td>
        <td>The same, driven by a specification</td>
    </tr>
    <tr>
        <td>delete</td>
        <td>Removes one document by its identifier</td>
    </tr>
    <tr>
        <td>clear</td>
        <td>Empties the collection</td>
    </tr>
    <tr>
        <td>getById</td>
        <td>Reads one document, with _id mapped back to id</td>
    </tr>
    <tr>
        <td>getByCriteria</td>
        <td>Reads a filtered page together with the total number of matches</td>
    </tr>
    <tr>
        <td>getBySpecification</td>
        <td>The same, from a specification</td>
    </tr>
    <tr>
        <td>countByCriteria</td>
        <td>Counts matches without loading them</td>
    </tr>
    <tr>
        <td>countBySpecification</td>
        <td>The same, from a specification</td>
    </tr>
    <tr>
        <td>changesByCriteria</td>
        <td>Watches a change stream and emits create, update and delete events</td>
    </tr>
</table>

### MongoAttachmentRepository

Implements `IAttachmentRepository<T>` on GridFS, in a bucket named by `collection`. Inject it through the `IAttachmentRepository` token.

Methods:

<table>
    <tr>
        <td>upload</td>
        <td>Streams a file into the bucket under the given id</td>
    </tr>
    <tr>
        <td>getInfo</td>
        <td>Returns the file name, content type and length, or null when there is no such file</td>
    </tr>
    <tr>
        <td>getStream</td>
        <td>Opens a readable stream over the file, optionally over a byte range</td>
    </tr>
    <tr>
        <td>delete</td>
        <td>Removes the file from the bucket</td>
    </tr>
</table>

### MongoUnitOfWork

Implements `IUnitOfWork`. Inject it through the `IUnitOfWork` token.

Methods:

<table>
    <tr>
        <td>scope</td>
        <td>Runs the callback inside a MongoDB transaction, committing it on success and aborting it on a throw</td>
    </tr>
</table>

The callback receives an `IMongoTransaction`, an `ITransaction` whose `session` is the driver's `ClientSession`. Pass it on as `{ transaction }` to every repository call that has to take part in it.

## 🔧 Functions

<table>
    <tr>
        <td>getMongoUrl(config: MongoConfig): string</td>
        <td>Builds the connection string the repositories connect with</td>
    </tr>
</table>
