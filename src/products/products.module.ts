import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from './products.schema';
import { AuthorizationService } from 'src/utils/authorization';

@Module({
  imports:[MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),],
  providers: [ProductsService,AuthorizationService],
  controllers: [ProductsController],
  exports: [ProductsService, MongooseModule]
})
export class ProductsModule {}
