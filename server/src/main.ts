import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { renderFile } from 'ejs';
import { join } from 'path';
import * as express from 'express';
import * as jsonfile from 'jsonfile';

const config = jsonfile.readFileSync('./config.json');

(async () => {
    const app = await NestFactory.create(AppModule);
    app.use(express.static(join(__dirname, '../../ui/build')));
    await app.listen(config.http_port || 3000);
})();
