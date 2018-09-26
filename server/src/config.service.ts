import { Injectable } from '@nestjs/common';
import * as jsonfile from 'jsonfile';

@Injectable()
export class ConfigService {
    public http_port: string;
    public songfiles: any;
    constructor() {
        const cfg = jsonfile.readFileSync('./config.json');
        this.http_port = cfg.http_port || 3000;
        this.songfiles = cfg.songfiles;
    }
}
