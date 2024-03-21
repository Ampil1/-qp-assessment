import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';


import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './utils/jwt.strategy';


import * as dotenv from 'dotenv';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { OrderModule } from './order/order.module';


dotenv.config();
console.log(process.env.MONGO_DB_URL_STAGING)
@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGO_DB_URL_STAGING,
        useNewUrlParser: true,
        useUnifiedTopology: true
      }),
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({ secret: process.env.SECRET, signOptions: { expiresIn: '1d' } }),
    UsersModule,
    ProductsModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [
    JwtStrategy,
    AppService
  ],
  exports: [
    UsersModule,
    MongooseModule,
    PassportModule,
    JwtModule,
    JwtStrategy
  ]
})

export class AppModule {

}