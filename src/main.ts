import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { UsersModule } from './users/users.module';
import * as dotenv from 'dotenv';
import { ProductsModule } from './products/products.module';
import { OrderModule } from './order/order.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  dotenv.config();
  
		let options = new DocumentBuilder().setTitle('Grocery Booking API').setBasePath("/").setVersion('v1').addBearerAuth().build();
		const document = SwaggerModule.createDocument(app, options, {
			include: [ UsersModule,ProductsModule,OrderModule]
		});
		SwaggerModule.setup('/explorer', app, document);
	console.log(`your server running:localhost:3000`)
  await app.listen(3000);
}
bootstrap();