import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { DatabaseModule } from '../typeorms/database.module'; 
import { productProviders } from './products.providers';
import { productImageProviders } from '../productimages/productimages.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductsController],
  providers: [ProductsService,...productProviders,...productImageProviders],
})
export class ProductsModule {}
