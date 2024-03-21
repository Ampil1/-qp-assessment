import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class OrderService {
    constructor(@InjectModel('Order') private readonly orderModel: Model<any>){}


    public async createOrder(orderData): Promise<any> {
        return await this.orderModel.create(orderData);
    }

    public async getAllOrderForUser(userId: string, page: number, limit: number,): Promise<Array<any>> {
  
        const skip = page * limit;
        return await this.orderModel.find({ userId: userId }).sort({ createdAt: -1 }).limit(limit).skip(skip);
    }

    public async countAllOrderForUser(userId: string): Promise<number> {
 
        return await this.orderModel.countDocuments({ userId: userId });
    }
}
