import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { renderFile } from 'ejs';
import { join } from 'path';
import * as express from 'express';

(async () => {
    const app = await NestFactory.create(AppModule);
    app.use(express.static(join(__dirname, '../../ui/build')));
    await app.listen(app.get('ConfigService')['http_port'] || 1888);
})();
