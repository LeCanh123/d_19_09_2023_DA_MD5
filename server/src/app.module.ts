import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './module/products/products.module';
import { UsersModule } from './module/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from './module/category/category.module';
import { GatewayModule } from './gateway/gateway.module';


@Module({
  imports: [ConfigModule.forRoot(),ProductsModule,UsersModule,CategoryModule,
  GatewayModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
