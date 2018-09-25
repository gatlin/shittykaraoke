import { Module } from '@nestjs/common';
import { WsGateway } from './ws.gateway';
import { SongDBService } from './songdb.service';
import { ConfigService } from './config.service';

@Module({
    providers: [WsGateway, SongDBService, ConfigService]
})
export class WsModule { };
