import {Injectable} from "@nestjs/common";
import {HttpService} from "@nestjs/axios";

@Injectable()
export class GoogleService {
    constructor(private http: HttpService) { }

    async getUserId(token: string): Promise<string> {
        const { data } = await this.http
            .get('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + token).toPromise();

        return data.user_id;
    }

    async getData(token: string): Promise<{ email, id }> {
        const { data } = await this.http
            .get('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + token).toPromise();

        return {
            id: data.user_id,
            email: data.email
        };
    }
}