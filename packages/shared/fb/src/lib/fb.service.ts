import {Injectable} from "@nestjs/common";
import {HttpService} from "@nestjs/axios";

@Injectable()
export class FbService {
    constructor(private http: HttpService) { }

    async getUserId(token: string): Promise<string> {
        const { data } = await this.http
            .get('https://graph.facebook.com/me?access_token=' + token).toPromise();

        return data.id;
    }

    async getData(token: string): Promise<{ id, email }> {
        const { data } = await this.http
            .get('https://graph.facebook.com/me?fields=email,id&access_token=' + token).toPromise();

        return data;
    }
}