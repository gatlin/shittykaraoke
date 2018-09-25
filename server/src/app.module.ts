import { Module } from '@nestjs/common';
import { WsModule } from './ws.module';
import { ConfigService } from './config.service';

@Module({
    imports: [WsModule]
})
export class AppModule { }
