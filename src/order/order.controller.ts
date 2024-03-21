import { Body, Controller, Get, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/utils/jwt.strategy';
import { AuthorizationService } from '../utils/authorization';
import { ProductsService } from '../products/products.service';
import { OrderCreateDto } from './order.schema';
import { ProductFilterQuery } from 'src/products/products.dto';
import { query } from 'express';

@ApiTags('Order')
@Controller('order')
export class OrderController {
    constructor(
        private orderService: OrderService,
        private authService: AuthorizationService,
        private productsService: ProductsService
        ){}


    @Post('/user/create')
	@ApiOperation({ summary: 'Create product' })
	@ApiResponse({ status: 200, description: 'Success message', type: 'Product created ' })
	@ApiResponse({ status: 400, description: 'Bad request message', type: 'Bad request' })
	@ApiResponse({ status: 404, description: 'Unauthorized or Not found', type: "not found" })
	@UseGuards(AuthGuard('jwt'))
	@ApiBearerAuth()
	public async createProduct(@GetUser() user: any, @Body() productData:OrderCreateDto ): Promise<any> {
		this.authService.validateUserRole(user);
        try {
            const productExist = await this.productsService.getProductDetail(productData.productId);
            if (!productExist) {
                return { response_code: HttpStatus.BAD_REQUEST, response_data: `${productData.productId} does not exist` };
            }
            
            // Check if product price and quantity are valid numbers
            if (isNaN(productExist.variant[0].price) || isNaN(productData.quantity)) {
                return { response_code: HttpStatus.BAD_REQUEST, response_data: "Invalid price or quantity" };
            }
            
            // Calculate subtotal
            const subtotal = productExist.variant[0].price * productData.quantity;
            
            // Calculate tax using a tax rate of 18%
            const taxRate = 0.18; // 18% as a decimal
            const tax = subtotal * taxRate;
            
            // Construct order object
            const orderCreate = {
                userId: user.id,
                productId: productExist._id,
                productName: productExist.productName,
                quantity: productData.quantity,
                subTotal: subtotal,
                tax: tax,
                taxInfo: {
                    taxName: 'GST',
                    amount: tax
                },
                grandTotal: subtotal + tax
            };
        
            const createdOrder = await this.orderService.createOrder(orderCreate);
        
            if (createdOrder) {
                return { response_code: HttpStatus.CREATED, response_data: "Order created successfully", order: createdOrder };
            } else {
                return { response_code: HttpStatus.INTERNAL_SERVER_ERROR, response_data: "Failed to create order" };
            }
        } catch (e) {
            return { response_code: HttpStatus.INTERNAL_SERVER_ERROR, response_data: e.message };
        }
    }
    
    
    @Get('/list')
    @ApiOperation({ summary: 'Get all order for user' })
    @ApiQuery({ name: "page", description: "page", required: false, type: Number })
    @ApiQuery({ name: "limit", description: "limit", required: false, type: Number })
    @ApiResponse({ status: 200, description: 'Return list of order for user', type: "" })
    @ApiResponse({ status: 404, description: 'Unauthorized or Not found', type: "" })
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    public async GetOrderListForUser(@GetUser() user: any, @Query() query:ProductFilterQuery ): Promise<any> {
        this.authService.validateUserRole(user);
        try {
            const page = Number(query.page) || 0;
			const limit = Number(query.limit) || 10;
            const orders = await Promise.all([
                this.orderService.getAllOrderForUser(user._id,page,limit),
                this.orderService.countAllOrderForUser(user._id)
            ])
            return {response_code: HttpStatus.OK, response_data: orders[0],  total: orders[1] }
        } catch (e) {
            return { response_code: HttpStatus.INTERNAL_SERVER_ERROR, response_data: e.message };
        }
    }
}
