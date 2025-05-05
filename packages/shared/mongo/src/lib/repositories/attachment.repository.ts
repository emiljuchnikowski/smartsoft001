import { Injectable } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import { Readable, Stream } from 'stream';
import * as mongo from 'mongodb';

import { IEntity, IAttachmentRepository } from '@smartsoft001/domain-core';
import { MongoConfig } from '@smartsoft001/mongo';

import { getMongoUrl } from '../mongo.utils';

@Injectable()
export class MongoAttachmentRepository<
  T extends IEntity<string>,
> extends IAttachmentRepository<T> {
  constructor(private config: MongoConfig) {
    super();
  }

  async upload(
    data: {
      id: string;
      fileName: string;
      stream: Stream;
      mimeType: string;
      encoding: string;
    },
    options?: { streamCallback?: (r) => void },
  ): Promise<void> {
    const client = await MongoClient.connect(this.getUrl());

    return await new Promise<void>((res, rej) => {
      const db = client.db(this.config.database);
      const bucket = new mongo.GridFSBucket(db, {
        bucketName: this.config.collection,
      });

      const writeStream = bucket.openUploadStreamWithId(
        data.id as any,
        data.fileName,
        {
          contentType: data.mimeType,
        },
      );

      if (options?.streamCallback) options.streamCallback(writeStream);

      data.stream.pipe(writeStream);

      writeStream.on('error', (error) => {
        rej(error);
      });

      writeStream.on('finish', () => {
        res();
      });
    });
  }

  async getInfo(
    id: string,
  ): Promise<{ fileName: string; contentType: string; length: number }> {
    const client = await MongoClient.connect(this.getUrl());

    const db = client.db(this.config.database);

    const bucket = new mongo.GridFSBucket(db, {
      bucketName: this.config.collection,
    });

    const items = await bucket
      .find({
        _id: id as any,
      })
      .toArray();

    if (!items || items.length === 0) return null;

    return {
      fileName: items[0].filename,
      contentType: items[0].contentType,
      length: items[0].length,
    };
  }

  async getStream(
    id: string,
    options: { start: number; end: number } | undefined,
  ): Promise<Readable> {
    const client = await MongoClient.connect(this.getUrl());

    const db = client.db(this.config.database);
    const bucket = new mongo.GridFSBucket(db, {
      bucketName: this.config.collection,
    });

    return bucket.openDownloadStream(id as any, options);
  }

  async delete(id: string): Promise<void> {
    const client = await MongoClient.connect(this.getUrl());

    const db = client.db(this.config.database);
    const bucket = new mongo.GridFSBucket(db, {
      bucketName: this.config.collection,
    });

    await bucket.delete(id as any);
    await client.close();
  }

  private getUrl(): string {
    return getMongoUrl(this.config);
  }
}
