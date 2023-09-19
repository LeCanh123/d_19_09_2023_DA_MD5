import { Module } from '@nestjs/common';
import { BagsService } from './bags.service';
import { BagsController } from './bags.controller';

@Module({
  controllers: [BagsController],
  providers: [BagsService],
})
export class BagsModule {}
