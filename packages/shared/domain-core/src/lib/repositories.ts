import { IUser } from '@smartsoft001/users';
import { Observable } from 'rxjs';

import { IEntity, ISpecification } from './interfaces';

/**
 * ITransaction defines the structure of a transaction context that can be used to
 * perform a series of database operations as a single atomic unit of work.
 *
 * @interface ITransaction
 */
export interface ITransaction {
  /**
   * The connection object that provides access to the database.
   *
   * This property typically represents the active database connection that is used
   * to execute operations within the transaction. The exact type of the connection
   * may vary depending on the database being used (e.g., MongoDB, SQL, etc.).
   *
   * @type {any}
   */
  connection: any;
}

/**
 * IUnitOfWork is an abstract class that defines the contract for managing transactional operations
 * across multiple repositories or services. This pattern ensures that a set of operations either
 * all succeed or all fail, maintaining data consistency.
 *
 * @interface IUnitOfWork
 */
export abstract class IUnitOfWork {
  /**
   * Executes a set of operations within a transactional scope.
   *
   * @param {function(ITransaction): Promise<void>} definition - A function that contains the operations to be executed within the transaction.
   * The function receives an `ITransaction` object that provides the necessary context for the transaction.
   *
   * @returns {Promise<void>} - A promise that resolves when the transactional operations are completed successfully.
   *
   * @throws {Error} - Throws an error if the transaction fails, in which case all operations are rolled back.
   *
   * @example
   * await this.unitOfWork.scope(async (tx) => {
   *       await this.itemRepository.updatePartial(
   *         {
   *           id: id1,
   *           status: "finished",
   *         },
   *         user,
   *         { transaction: tx }
   *       );
   *
   *       await this.itemRepository.updatePartial(
   *           {
   *             id: id2,
   *             status: "finished",
   *           },
   *           user,
   *           { transaction: tx }
   *       );
   * });
   */
  abstract scope(
    definition: (transaction: ITransaction) => Promise<void>,
  ): Promise<void>;
}

/**
 *
 * @interface IItemRepositoryOptions
 */
export interface IItemRepositoryOptions {
  transaction: ITransaction;
}

/**
 * IItemRepository is an abstract class that defines the contract for a repository
 * responsible for managing entities of type `T` in a storage system. This repository
 * interface provides a set of methods for creating, updating, deleting, and querying
 * entities, with support for transactional operations and various query criteria.
 *
 * @template T - The type of entity that this repository will manage. The entity should extend `IEntity<string>`.
 *
 * @interface IItemRepository
 */
export abstract class IItemRepository<T extends IEntity<string>> {
  /**
   * Creates a new entity in the storage system.
   *
   * @param {T} item - The entity to be created.
   * @param {IUser} user - The user performing the operation.
   * @param {IItemRepositoryOptions} [options] - Optional parameters for the operation, including transaction context.
   *
   * @returns {Promise<void>} - A promise that resolves when the entity is successfully created.
   */
  abstract create(
    item: T,
    user: IUser,
    options?: IItemRepositoryOptions,
  ): Promise<void>;

  /**
   * Creates multiple entities in the storage system.
   *
   * @param {T[]} list - The list of entities to be created.
   * @param {IUser} user - The user performing the operation.
   * @param {IItemRepositoryOptions} [options] - Optional parameters for the operation, including transaction context.
   *
   * @returns {Promise<void>} - A promise that resolves when all entities are successfully created.
   */
  abstract createMany(
    list: T[],
    user: IUser,
    options?: IItemRepositoryOptions,
  ): Promise<void>;

  /**
   * Updates an existing entity in the storage system.
   *
   * @param {T} item - The entity to be updated.
   * @param {IUser} user - The user performing the operation.
   * @param {IItemRepositoryOptions} [options] - Optional parameters for the operation, including transaction context.
   *
   * @returns {Promise<void>} - A promise that resolves when the entity is successfully updated.
   */
  abstract update(
    item: T,
    user: IUser,
    options?: IItemRepositoryOptions,
  ): Promise<void>;

  /**
   * Partially updates an existing entity in the storage system.
   *
   * @param {Partial<T> & { id: string }} item - The partial entity data to be updated along with the entity's ID.
   * @param {IUser} user - The user performing the operation.
   * @param {IItemRepositoryOptions} [options] - Optional parameters for the operation, including transaction context.
   *
   * @returns {Promise<void>} - A promise that resolves when the entity is successfully updated.
   */
  abstract updatePartial(
    item: Partial<T> & { id: string },
    user: IUser,
    options?: IItemRepositoryOptions,
  ): Promise<void>;

  /**
   * Partially updates multiple entities that match the specified criteria.
   *
   * @param {any} criteria - The criteria used to select the entities to be updated.
   * @param {Partial<T>} set - The partial data to be set on the matching entities.
   * @param {IUser} user - The user performing the operation.
   * @param {IItemRepositoryOptions} [options] - Optional parameters for the operation, including transaction context.
   *
   * @returns {Promise<void>} - A promise that resolves when the entities are successfully updated.
   */
  abstract updatePartialManyByCriteria(
    criteria: any,
    set: Partial<T>,
    user: IUser,
    options?: IItemRepositoryOptions,
  ): Promise<void>;

  /**
   * Partially updates multiple entities that match the specified specification.
   *
   * @param {ISpecification} spec - The specification used to select the entities to be updated.
   * @param {Partial<T>} set - The partial data to be set on the matching entities.
   * @param {IUser} user - The user performing the operation.
   * @param {IItemRepositoryOptions} [options] - Optional parameters for the operation, including transaction context.
   *
   * @returns {Promise<void>} - A promise that resolves when the entities are successfully updated.
   */
  abstract updatePartialManyBySpecification(
    spec: ISpecification,
    set: Partial<T>,
    user: IUser,
    options?: IItemRepositoryOptions,
  ): Promise<void>;

  /**
   * Deletes an entity from the storage system by its ID.
   *
   * @param {string} id - The ID of the entity to be deleted.
   * @param {IUser} user - The user performing the operation.
   * @param {IItemRepositoryOptions} [options] - Optional parameters for the operation, including transaction context.
   *
   * @returns {Promise<void>} - A promise that resolves when the entity is successfully deleted.
   */
  abstract delete(
    id: string,
    user: IUser,
    options?: IItemRepositoryOptions,
  ): Promise<void>;

  /**
   * Retrieves an entity from the storage system by its ID.
   *
   * @param {string} id - The ID of the entity to be retrieved.
   * @param {IItemRepositoryOptions} [repoOptions] - Optional parameters for the operation, including transaction context.
   *
   * @returns {Promise<T>} - A promise that resolves to the retrieved entity.
   */
  abstract getById(
    id: string,
    repoOptions?: IItemRepositoryOptions,
  ): Promise<T>;

  /**
   * Retrieves entities from the storage system that match the specified criteria.
   *
   * @param {any} criteria - The criteria used to select the entities.
   * @param {any} [options] - Optional parameters for the operation, such as pagination or sorting.
   *
   * @returns {Promise<{ data: T[]; totalCount: number }>} - A promise that resolves to an object containing the matching entities and the total count.
   */
  abstract getByCriteria(
    criteria: any,
    options?: any,
  ): Promise<{ data: T[]; totalCount: number }>;

  /**
   * Retrieves entities from the storage system that match the specified specification.
   *
   * @param {ISpecification} spec - The specification used to select the entities.
   * @param {any} [options] - Optional parameters for the operation, such as pagination or sorting.
   *
   * @returns {Promise<{ data: T[]; totalCount: number }>} - A promise that resolves to an object containing the matching entities and the total count.
   */
  abstract getBySpecification(
    spec: ISpecification,
    options?: any,
  ): Promise<{ data: T[]; totalCount: number }>;

  /**
   * Counts the number of entities in the storage system that match the specified criteria.
   *
   * @param {any} criteria - The criteria used to count the entities.
   *
   * @returns {Promise<number>} - A promise that resolves to the count of matching entities.
   */
  abstract countByCriteria(criteria: any): Promise<number>;

  /**
   * Counts the number of entities in the storage system that match the specified specification.
   *
   * @param {ISpecification} spec - The specification used to count the entities.
   *
   * @returns {Promise<number>} - A promise that resolves to the count of matching entities.
   */
  abstract countBySpecification(spec: ISpecification): Promise<number>;

  /**
   * Clears all entities from the storage system.
   *
   * @param user
   *
   * @returns {Promise<void>} - A promise that resolves when the storage system is cleared.
   */
  abstract clear(user: IUser | IItemRepositoryOptions): Promise<void>;

  /**
   * Returns an observable that emits changes to entities that match the specified criteria.
   *
   * @param {any} criteria - The criteria used to select the entities to observe.
   *
   * @returns {Observable<any>} - An observable that emits changes to the matching entities.
   */
  abstract changesByCriteria(criteria: { id?: string }): Observable<any>;
}

/**
 * IAttachmentRepository is an abstract class that defines the contract for managing file attachments
 * in a storage system. This interface can be implemented to work with various storage backends, such as
 * MongoDB GridFS, Amazon S3, Google Cloud Storage, or any other file storage solution.
 *
 * @template T - The type of the entity that this repository will manage. The entity should extend `IEntity<string>`.
 *
 * @interface IAttachmentRepository
 */
export abstract class IAttachmentRepository<T extends IEntity<string>> {
  /**
   * Uploads a file to the storage system.
   *
   * @param {Object} data - The data required to upload the file.
   * @param {string} data.id - A unique identifier for the file.
   * @param {string} data.fileName - The name of the file to be uploaded.
   * @param {Stream} data.stream - The stream of the file to be uploaded.
   * @param {string} data.mimeType - The MIME type of the file.
   * @param {string} data.encoding - The encoding of the file.
   *
   * @param {Object} [options] - Optional parameters for the upload.
   * @param {Function} [options.streamCallback] - A callback function that gets invoked with the upload stream.
   *
   * @returns {Promise<void>} - A promise that resolves when the upload is complete.
   *
   * @throws {Error} - Throws an error if the upload fails.
   *
   * @example
   * // Example usage with MongoDB implementation:
   * const repository = new MongoAttachmentRepository(config);
   *
   * const fileStream = fs.createReadStream('/path/to/file');
   *
   * await repository.upload({
   *   id: 'unique-file-id',
   *   fileName: 'example.txt',
   *   stream: fileStream,
   *   mimeType: 'text/plain',
   *   encoding: 'utf-8'
   * }, {
   *   streamCallback: (writeStream) => {
   *     console.log('Upload started');
   *   }
   * });
   *
   * console.log('File uploaded successfully');
   */
  abstract upload(
    data: {
      id: string;
      fileName: string;
      stream: any;
      mimeType: string;
      encoding: string;
    },
    options?: { streamCallback?: (r: any) => void },
  ): Promise<void>;

  /**
   * Retrieves metadata information about a file stored in the storage system.
   *
   * @param {string} id - The unique identifier of the file.
   *
   * @returns {Promise<{ fileName: string, contentType: string, length: number } | null>}
   * - A promise that resolves to an object containing file metadata, or `null` if the file is not found.
   *
   * @throws {Error} - Throws an error if retrieving the file information fails.
   */
  abstract getInfo(
    id: string,
  ): Promise<{ fileName: string; contentType: string; length: number }>;

  /**
   * Retrieves a stream for downloading a file from the storage system.
   *
   * @param {string} id - The unique identifier of the file.
   * @param {Object} [options] - Optional parameters for retrieving a specific range of the file.
   * @param {number} [options.start] - The starting byte position for the stream.
   * @param {number} [options.end] - The ending byte position for the stream.
   *
   * @returns {Promise<any>} - A promise that resolves to a readable stream of the file.
   *
   * @throws {Error} - Throws an error if retrieving the file stream fails.
   */
  abstract getStream(
    id: string,
    options?: { start: number; end: number },
  ): Promise<any>;

  /**
   * Deletes a file from the storage system.
   *
   * @param {string} id - The unique identifier of the file to be deleted.
   *
   * @returns {Promise<void>} - A promise that resolves when the file has been successfully deleted.
   *
   * @throws {Error} - Throws an error if the deletion fails.
   */
  abstract delete(id: string): Promise<void>;
}
