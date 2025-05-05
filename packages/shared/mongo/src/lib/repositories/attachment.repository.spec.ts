import { MongoClient, GridFSBucket } from 'mongodb';
import { MongoAttachmentRepository } from './attachment.repository';
import { IEntity } from '@smartsoft001/domain-core';
import { Readable } from 'stream';

jest.mock('mongodb', () => {
  const mockOpenDownloadStream = jest.fn();
  const mockDelete = jest.fn();
  const mockClose = jest.fn();
  const mockToArray = jest.fn();
  const mockFind = jest.fn().mockReturnValue({
    toArray: mockToArray, // Return a mock cursor with toArray method
  });

  const mockWriteStream = {
    on: jest.fn((event, callback) => {
      if (event === 'finish') {
        setTimeout(callback, 0); // Simulate the 'finish' event after a timeout
      } else if (event === 'error') {
        // You can use this to simulate an error event in your test
        mockWriteStream._errorCallback = callback;
      }
      return mockWriteStream; // Return this for chaining
    }),
    pipe: jest.fn(function () {
      return this; // Make sure pipe is chainable
    }),
    once: jest.fn((event, callback) => {
      // Handle 'once' event similarly to 'on'
      if (event === 'finish') {
        setTimeout(callback, 0); // Simulate the 'finish' event after a timeout
      }
      return mockWriteStream; // Chainable
    }),
    emit: jest.fn((event, ...args) => {
      if (event === 'finish') {
        setTimeout(() => {
          // Simulate the finish event
          mockWriteStream.on('finish', () => {});
        }, 0);
      }
      return true; // Return true for emit as a valid event
    }),
    removeListener: jest.fn((event, callback) => {
      // Just return the mock itself for chaining
      return mockWriteStream;
    }),
    _errorCallback: null, // Used to simulate an error when you trigger it manually
  };
  const mockOpenUploadStreamWithId = jest.fn().mockReturnValue(mockWriteStream);
  const mockGridFSBucket = jest.fn().mockImplementation(() => ({
    delete: mockDelete,
    openDownloadStream: mockOpenDownloadStream,
    find: mockFind,
    openUploadStreamWithId: mockOpenUploadStreamWithId,
  }));

  const mockDb = jest.fn().mockReturnValue({
    GridFSBucket: mockGridFSBucket,
  });

  const mockConnect = jest.fn().mockResolvedValue({
    db: jest.fn(() => mockDb()),
    close: mockClose,
  });

  return {
    MongoClient: {
      connect: mockConnect,
    },
    GridFSBucket: mockGridFSBucket,
    __mockDelete: mockDelete, // Expose the mockDelete for assertions
    __mockClose: mockClose, // Expose the mockClose for assertions
    __mockOpenDownloadStream: mockOpenDownloadStream, // Expose the mockOpenDownloadStream for assertions
    __mockToArray: mockToArray, // Expose the mockToArray for assertions
    __mockWriteStream: mockWriteStream, // Expose the mockWriteStream for assertions
    __mockOpenUploadStreamWithId: mockOpenUploadStreamWithId, // Expose the mockOpenUploadStreamWithId for assertions
  };
});

describe('shared-mongo: MongoAttachmentRepository', () => {
  let model: MongoAttachmentRepository<IEntity<string>>;
  const mockConfig = {
    database: 'testDB',
    host: 'host',
    port: 4200,
    collection: 'testCollection',
  };

  const data = {
    id: 'test-id',
    fileName: 'test-file.txt',
    stream: new Readable(),
    mimeType: 'text/plain',
    encoding: 'utf8',
  };

  const options = {
    streamCallback: jest.fn(),
  };

  // Declare mockDelete here to access in the test scope
  const mongodbMock = jest.requireMock('mongodb');
  const mockDelete = mongodbMock.__mockDelete;
  const mockClose = mongodbMock.__mockClose;
  const mockOpenDownloadStream = mongodbMock.__mockOpenDownloadStream;
  const mockToArray = mongodbMock.__mockToArray;
  const mockWriteStream = mongodbMock.__mockWriteStream;
  const mockOpenUploadStreamWithId = mongodbMock.__mockOpenUploadStreamWithId;
  const mockStream = new Readable();
  mockStream._read = jest.fn();

  beforeEach(() => {
    model = new MongoAttachmentRepository<IEntity<string>>(mockConfig); // Pass required config
  });

  it('delete() should delete a file from GridFSBucket and close the client', async () => {
    const id = 'test-id';
    const mockUrl = 'mock-url';
    jest.spyOn(model as any, 'getUrl').mockImplementation(() => mockUrl);

    await model.delete(id);

    // Assertions
    expect(MongoClient.connect).toHaveBeenCalledWith(mockUrl);
    expect(GridFSBucket).toHaveBeenCalledWith(expect.anything(), {
      bucketName: mockConfig.collection,
    });
    expect(mockDelete).toHaveBeenCalledWith(id);
    expect(mockClose).toHaveBeenCalled();
  });

  it('getStream() should return a readable stream when getStream is called', async () => {
    const id = 'test-id';
    const options = { start: 0, end: 100 };
    const mockUrl = 'mock-url';
    jest.spyOn(model as any, 'getUrl').mockImplementation(() => mockUrl);

    // Mock the return value of openDownloadStream to return a mock Readable stream
    const mockStream = new Readable();
    mockStream._read = jest.fn(); // Implement the _read method to make it a valid Readable stream
    mockOpenDownloadStream.mockReturnValue(mockStream);

    const stream = await model.getStream(id, options);

    // Assertions
    expect(MongoClient.connect).toHaveBeenCalledWith(mockUrl); // Ensure MongoClient.connect is called with the correct URL
    expect(mockOpenDownloadStream).toHaveBeenCalledWith(id, options); // Check if openDownloadStream was called with the right parameters
    expect(stream).toBe(mockStream); // Ensure the returned stream is the one we mocked
  });

  it('getInfo() should return file info if the file exists', async () => {
    const id = 'test-id';
    const mockFileData = [
      {
        filename: 'test-file.txt',
        contentType: 'text/plain',
        length: 1024,
      },
    ];
    const mockUrl = 'mock-url';

    mockToArray.mockResolvedValueOnce(mockFileData); // Mock toArray to return mock file data

    const result = await model.getInfo(id);

    expect(MongoClient.connect).toHaveBeenCalledWith(mockUrl); // Ensure MongoClient.connect is called with the correct URL
    expect(result).toEqual({
      fileName: 'test-file.txt',
      contentType: 'text/plain',
      length: 1024,
    }); // Check if the correct file info is returned
  });

  it('getInfo() should return null if no file is found', async () => {
    const id = 'non-existent-id';

    // Mock the return value of toArray to return an empty array
    (MongoClient.connect as jest.Mock).mockResolvedValueOnce({
      db: jest.fn(() => ({
        GridFSBucket: jest.fn().mockImplementation(() => ({
          find: jest.fn().mockReturnValue({
            toArray: jest.fn().mockResolvedValue([]), // Return mock file data
          }),
        })),
      })),
      close: jest.fn(),
    });

    const result = await model.getInfo(id);

    expect(result).toBeNull(); // Expect null if no file is found
  });

  // it("upload() should upload file successfully", async () => {
  //   const mockUrl = "mock-url";
  //   jest.spyOn(model as any, "getUrl").mockImplementation(() => mockUrl);
  //
  //   const mockStream = new Readable();
  //   mockStream._read = jest.fn();
  //
  //   // Set up the stream to simulate data being piped
  //   data.stream = mockStream;
  //
  //   const result = model.upload(data);
  //
  //   // Ensure the MongoClient.connect method is called with the correct URL
  //   expect(MongoClient.connect).toHaveBeenCalledWith(mockUrl);
  //
  //   // Wait for the upload promise to resolve
  //   await expect(result).resolves.toBeUndefined();
  //
  //   // Ensure GridFSBucket and openUploadStreamWithId are called
  //   expect(GridFSBucket).toHaveBeenCalledWith(expect.anything(), {
  //     bucketName: mockConfig.collection,
  //   });
  //   expect(mockOpenUploadStreamWithId).toHaveBeenCalledWith(data.id, data.fileName, {
  //     contentType: data.mimeType,
  //   });
  //
  //   // Ensure the stream callback is called if provided
  //   expect(options.streamCallback).toHaveBeenCalledWith(mockWriteStream);
  //
  //   // Ensure data is piped into the write stream
  //   expect(mockStream.pipe).toHaveBeenCalledWith(mockWriteStream);
  // });

  // it("upload() should reject with error if upload fails", async () => {
  //   const mockUrl = "mock-url";
  //   jest.spyOn(model as any, "getUrl").mockImplementation(() => mockUrl);
  //
  //   const result = model.upload({
  //     ...data,
  //     stream: mockStream
  //   });
  //
  //   if (mockWriteStream._errorCallback) {
  //     mockWriteStream._errorCallback(new Error("Upload failed"));
  //   }
  //   // Ensure the upload rejects with the error
  //   // await expect(result.catch(e => e)).rejects.toThrowError("Upload failed");
  //
  //   await expect(result).rejects.toThrowError("Upload failed");
  // });
});
