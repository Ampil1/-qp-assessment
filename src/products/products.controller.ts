import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthorizationService } from '../utils/authorization';
import { GetUser, OptionalJwtAuthGuard } from 'src/utils/jwt.strategy';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ProductFilterQuery, ProductsSaveDTO } from './products.dto';

@ApiTags('Prduct')
@Controller('products')
export class ProductsController {
    constructor(private productService: ProductsService,
        private utilService: AuthorizationService,){}


    
    @Get('/admin/list')
	@ApiOperation({ summary: 'Get all product' })
	@ApiQuery({ name: "page", description: "page", required: false, type: Number })
	@ApiQuery({ name: "limit", description: "limit", required: false, type: Number })
	@ApiResponse({ status: 200, description: 'Return list of product', type: "list of Product" })
	@ApiResponse({ status: 404, description: 'Unauthorized or Not found', type: "Not found" })
	@UseGuards(AuthGuard('jwt'))
	@ApiBearerAuth()
	public async getAllProduct(@GetUser() user: any, @Query() query: ProductFilterQuery): Promise<any> {
		this.utilService.validateAdminRole(user);
		try {
			const page = Number(query.page) || 1;
			const limit = Number(query.limit) || 10;
			const products = await Promise.all([
				this.productService.getAllProduct(page - 1, limit),
				this.productService.countAllProduct()
			])
			return {response_code: HttpStatus.OK, response_data: products[0],  total: products[1] };
		} catch (e) {
            return  { response_code:HttpStatus.INTERNAL_SERVER_ERROR,response_data:e.message }
		}
	}
    @Post('/admin/create')
	@ApiOperation({ summary: 'Create product' })
	@ApiResponse({ status: 200, description: 'Success message', type: 'Product created ' })
	@ApiResponse({ status: 400, description: 'Bad request message', type: 'Bad request' })
	@ApiResponse({ status: 404, description: 'Unauthorized or Not found', type: "not found" })
	@UseGuards(AuthGuard('jwt'))
	@ApiBearerAuth()
	public async createProduct(@GetUser() user: any, @Body() productData: ProductsSaveDTO): Promise<any> {
		this.utilService.validateAdminRole(user);
		try {
			const productExist = await this.productService.findProductByTitle(productData.productName);
			if (productExist) return { response_code: HttpStatus.BAD_REQUEST, response_data: `${productData.productName} already avialable` }

			const product = await this.productService.createProduct(productData);
			if (product) return{ response_code: HttpStatus.CREATED, response_data: "Product create successfully" }
			else return  { response_code:HttpStatus.BAD_REQUEST,response_data:"sumoething went wrong" }
		} catch (e) {
			return  { response_code:HttpStatus.INTERNAL_SERVER_ERROR,response_data:e.message }
		}
	}


	@Put('/admin/update/:productId')
	@ApiOperation({ summary: 'Update product by productId' })
	@ApiResponse({ status: 200, description: 'Success message', type: "updated successfully" })
	@ApiResponse({ status: 400, description: 'Bad request message', type: "bad Request" })
	@ApiResponse({ status: 404, description: 'Unauthorized or Not found', type: "Not found" })
	@UseGuards(AuthGuard('jwt'))
	@ApiBearerAuth()
	public async updateProduct(@GetUser() user: any, @Param('productId') productId: string, @Body() productData: ProductsSaveDTO): Promise<any> {
		this.utilService.validateAdminRole(user);
		try {
			const productExist = await this.productService.getProductDetail(productId);
			if (!productExist) return { response_code: HttpStatus.BAD_REQUEST, response_data: `${productData.productName} already avialable` }


			const product = await this.productService.updateProduct(productId, productData);
			if (product) return{ response_code: HttpStatus.OK, response_data: "Product updated successfully" }
			else return  { response_code:HttpStatus.BAD_REQUEST,response_data:"sumoething went wrong" }
		} catch (e) {
			return  { response_code:HttpStatus.INTERNAL_SERVER_ERROR,response_data:e.message }
		}
	}

    @Delete('/admin/delete/:productId')
	@ApiOperation({ summary: 'Delete product by productId' })
	@ApiResponse({ status: 200, description: 'Success message', type: "Delete successfully" })
	@ApiResponse({ status: 400, description: 'Bad request message', type: "bad request" })
	@ApiResponse({ status: 404, description: 'Unauthorized or Not found', type: "not found" })
	@UseGuards(AuthGuard('jwt'))
	@ApiBearerAuth()
	public async deleteProduct(@GetUser() user: any, @Param('productId') productId: string): Promise<any> {
		this.utilService.validateAdminRole(user);
		try {
			const productExist = await this.productService.getProductDetail(productId);
			if (!productExist) return { response_code: HttpStatus.BAD_REQUEST, response_data:"Product Not available" };

			const product = await this.productService.deleteProduct(productId);
			if (product) return{ response_code: HttpStatus.OK, response_data: "Product deleted successfully" }
            else return  { response_code:HttpStatus.BAD_REQUEST,response_data:"sumoething went wrong" }
		} catch (e) {
			return  { response_code:HttpStatus.INTERNAL_SERVER_ERROR,response_data:e.message }
		}
	}




	@Get('/users/list')
	@ApiOperation({ summary: 'Get all enabled product fo user' })
	@ApiQuery({ name: "page", description: "page", required: false, type: Number })
	@ApiQuery({ name: "limit", description: "limit", required: false, type: Number })
	@ApiResponse({ status: 200, description: 'Return list of enabled product fo user', type: "" })
	@ApiResponse({ status: 404, description: 'Unauthorized or Not found', type: "" })
	public async productList(@Query() query:ProductFilterQuery ): Promise<any> {
		try {
			const page = Number(query.page) || 0;
			const limit = Number(query.limit) || 10;
			const list = await Promise.all([
				await this.productService.GetProductsForUser(page, limit),
				this.productService.countAllProductForUser()
			])
			let products = list[0];
            return {response_code: HttpStatus.OK, response_data: products,  total: list[1] };
		} catch (e) {

			return  { response_code:HttpStatus.INTERNAL_SERVER_ERROR,response_data:e.message }
		}
	}



}

