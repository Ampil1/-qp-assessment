import { Module, forwardRef } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema } from './order.schema';
import { AuthorizationService } from '../utils/authorization';
import { ProductsService } from '../products/products.service';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
  ProductsModule
],
  providers: [OrderService,AuthorizationService,ProductsService],
  controllers: [OrderController]
})
export class OrderModule {}
