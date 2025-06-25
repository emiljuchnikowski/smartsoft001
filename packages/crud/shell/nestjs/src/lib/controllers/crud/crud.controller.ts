import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { q2m } from "./query-to-mongo";
import { Response, Request } from "express";
import { Parser } from "json2csv";
import * as _ from "lodash";
import * as XLSX from "xlsx";
import * as Busboy from "busboy";
import { Readable } from "stream";
import * as moment from "moment-timezone";

import { CrudService } from "@smartsoft001/crud-shell-app-services";
import { IUser } from "@smartsoft001/users";
import { User } from "@smartsoft001/nestjs";
import { IEntity } from "@smartsoft001/domain-core";
import {AuthJwtGuard, AuthOrAnonymousJwtGuard} from "../../guards/auth/auth.guard";
import { CreateManyMode } from "@smartsoft001/crud-domain";
import {GuidService} from "@smartsoft001/utils";

@Controller("")
export class CrudController<T extends IEntity<string>> {
  constructor(protected readonly service: CrudService<T>) {}

  static getLink(req: Request): string {
    return req.protocol + "://" + req.headers.host + req.url;
  }

  @UseGuards(AuthJwtGuard)
  @Post()
  @HttpCode(200)
  async create(
    @Body() data: T,
    @User() user: IUser,
    @Res() res: Response
  ): Promise<Response> {
    const id = await this.service.create(data, user);
    res.set("Location", CrudController.getLink(res.req) + "/" + id);
    return res.send({
      id,
    });
  }

  @UseGuards(AuthJwtGuard)
  @Post("bulk")
  async createMany(
    @Body() data: T[],
    @User() user: IUser,
    @Res() res: Response,
    @Query("mode") mode: CreateManyMode
  ): Promise<Response> {
    const result = await this.service.createMany(data, user, { mode });
    return res.send(result);
  }

  @UseGuards(AuthOrAnonymousJwtGuard)
  @Get(":id")
  async readById(
    @Param() params: { id: string },
    @User() user: IUser
  ): Promise<T> {
    const result = await this.service.readById(params.id, user);

    if (!result) {
      throw new NotFoundException("Invalid id");
    }

    return result;
  }

  @UseGuards(AuthOrAnonymousJwtGuard)
  @Get()
  async read(
    @User() user: IUser,
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const object = this.getQueryObject(req.query);

    const { data, totalCount } = await this.service.read(
      object.criteria,
        {
            ...object.options,
          allowDiskUse:
              req.headers["content-type"] === "text/csv" || req.headers["content-type"] === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        },
      user
    );

    if (req.headers["content-type"] === "text/csv") {
      res.set({
        "Content-Type": "text/csv",
      });
      res.send(this.parseToCsv(data));
    }

    if (
      req.headers["content-type"] ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      res.set({
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      res.send(this.parseToXlsx(data));
    }

    res.send({
      data,
      totalCount,
      links: object.links(
        CrudController.getLink(req).split("?")[0],
        totalCount
      ),
    });
  }

  @UseGuards(AuthJwtGuard)
  @Put(":id")
  async update(
    @Param() params: { id: string },
    @Body() data: T,
    @User() user: IUser
  ): Promise<void> {
    await this.service.update(params.id, data, user);
  }

  @UseGuards(AuthJwtGuard)
  @Patch(":id")
  async updatePartial(
    @Param() params: { id: string },
    @Body() data: Partial<T>,
    @User() user: IUser
  ): Promise<void> {
    await this.service.updatePartial(params.id, data, user);
  }

  @UseGuards(AuthJwtGuard)
  @Delete(":id")
  async delete(
    @Param() params: { id: string },
    @User() user: IUser
  ): Promise<void> {
    await this.service.delete(params.id, user);
  }

  @Post("attachments")
  uploadAttachment(@Req() request: Request, @Res() response: Response) {
    const busboy = new Busboy({
      headers: request.headers,
    });
    const id = GuidService.create();
    const readable = new Readable();
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    readable._read = () => {};

    let fileName, encoding, mimeType;

    busboy.on("file", (field, file, resultFileName, resultEncoding, resultMimeType) => {
      fileName = resultFileName;
      encoding = resultEncoding;
      mimeType = resultMimeType;

      this.service
        .uploadAttachment({
          id,
          stream: readable,
          fileName,
          encoding,
          mimeType,
        });

      file.on("data", (data) => {
        readable.push(data);
      });
    });

    busboy.on("finish", function () {
      readable.push(null);
      response.set("Location", CrudController.getLink(response.req) + "/" + id);
      response.json({ id, fileName, contentType: mimeType , length: readable.readableLength });
      response.end();
    });

    return request.pipe(busboy);
  }

  @Get("attachments/:id")
  async downloadAttachment(@Param('id') id: string,  @Req() request: Request, @Res() response: Response) {
    const fileInfo = await this.service.getAttachmentInfo(id);

    if (request.headers.range) {
      const range = request.headers.range.substr(6).split('-')
      const start = parseInt(range[0], 10)
      const end = parseInt(range[1], 10) || null;

      const readstream = await this.service.getAttachmentStream(id, { start, end });

      response.status(206);
      response.set({
        'Accept-Ranges': 'bytes',
        'Content-Type': fileInfo.contentType,
        'Content-Range': `bytes ${start}-${end ? end : fileInfo.length - 1}/${
            fileInfo.length
        }`,
        'Content-Length': (end ? end : fileInfo.length) - start,
        'Content-Disposition': `attachment; filename="${encodeURI(fileInfo.fileName)}"`,
      })

      response.on('close', () => {
        readstream.destroy()
      })

      readstream.pipe(response);
    } else {
      const readstream = await this.service.getAttachmentStream(id);

      response.on('close', () => {
        readstream.destroy()
      })

      response.status(200)
      response.set({
        'Accept-Range': 'bytes',
        'Content-Type': fileInfo.contentType,
        'Content-Length': fileInfo.length,
        'Content-Disposition': `attachment; filename="${ encodeURI(fileInfo.fileName) }"`,
      })

      readstream.pipe(response);
    }
  }

  @Delete("attachments/:id")
  async deleteAttachment(@Param('id') id: string): Promise<void> {
    await this.service.deleteAttachment(id);
  }

  protected getQueryObject(queryObject: any): { criteria; options; links } {
    let q = "";

    Object.keys(queryObject).forEach((key) => {
      q += `&${key}=${queryObject[key]}`;
    });

    const result = q2m(q);

    return result;
  }

  protected parseToXlsx(data: T[]) {
    if (!data || !data.length) {
      return "";
    }

    const { res } = this.getDataWithFields(data);

    const ws = XLSX.utils.json_to_sheet(res);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "data");

    return XLSX.write(wb, { bookType: "xlsx", type: "buffer" });
  }

  protected parseToCsv(data: T[]): string {
    if (!data || !data.length) {
      return "";
    }

    const { res, fields } = this.getDataWithFields(data);

    return new Parser(fields).parse(data);
  }

  protected getDataWithFields(data: Array<T>): { res; fields } {
    const fields = [];

    const execute = (item, baseKey, baseItem) => {
      Object.keys(item).forEach((key) => {
        if (item[key] && (typeof item[key] === 'string')) {
          item[key] = item[key].replace(/<[^>]*>?/gm, '')
        }

        if (item[key] && (item[key] instanceof Date)) {
          item[key] = moment(item[key]).tz("Europe/Warsaw").format('YYYY-MM-DD HH:mm:ss')
        }

        const val = item[key];

        if (_.isArray(val)) {
          return;
        } else if (_.isObject(val) && Object.keys(val).length) {
          execute(val, baseKey + key + "_", baseItem);
        } else if (baseKey) {
          baseItem[baseKey + key] = val;
          if (!fields.some((f) => f === baseKey + key))
            fields.push(baseKey + key);
        } else {
          if (!fields.some((f) => f === key)) fields.push(key);
        }
      });
    };

    data.forEach((item) => {
      execute(item, "", item);
    });

    data.forEach((item) => {
      Object.keys(item).forEach((key) => {
        if (!fields.some((f) => f === key)) {
          delete item[key];
        }
      });
    });

    return { res: data, fields };
  }
}
