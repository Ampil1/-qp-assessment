import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductsSaveDTO } from './products.dto';

@Injectable()
export class ProductsService {
    constructor(@InjectModel('Product') private readonly productModel: Model<any>){}



    public async getAllProduct(page: number, limit: number): Promise<Array<any>> {
		const skip = page * limit;
		const products = await this.productModel.find({}).limit(limit).skip(skip);
		return products;
	}

	public async countAllProduct(): Promise<number> {
		const products = await this.productModel.countDocuments({});
		return products;
	}
    public async createProduct(productData: ProductsSaveDTO): Promise<any> {
		const product = await this.productModel.create(productData);
		return product;
	}

    public async findProductByTitle(title: String) {
		const response = await this.productModel.findOne({ productName: title });
		return response;
	}

    public async updateProduct(productId: string, productData: ProductsSaveDTO): Promise<any> {
		const product = await this.productModel.findByIdAndUpdate(productId, productData, { new: true });
		return product;
	}

    public async getProductDetail(productId: string): Promise<any> {
		const product = await this.productModel.findById(productId);
		return product;
	}

    public async deleteProduct(productId: string): Promise<any> {
		const response = await this.productModel.findByIdAndDelete(productId);
		return response;
	}

    public async GetProductsForUser(page: number, limit: number): Promise<Array<any>> {
		const skip = page * limit;
		let products = await this.productModel.find({}).limit(limit).skip(skip);
		return products;
	}

	public async countAllProductForUser(): Promise<number> {
		const products = await this.productModel.countDocuments({});
		return products;
	}
}
