import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { SongDBService } from '../songdb';

@Module({
    providers: [EventsGateway, SongDBService]
})
export class EventsModule { };
