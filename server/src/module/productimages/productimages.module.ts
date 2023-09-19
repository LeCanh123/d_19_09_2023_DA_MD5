import { Module } from '@nestjs/common';
import { ProductimagesService } from './productimages.service';
import { ProductimagesController } from './productimages.controller';

@Module({
  controllers: [ProductimagesController],
  providers: [ProductimagesService],
})
export class ProductimagesModule {}
