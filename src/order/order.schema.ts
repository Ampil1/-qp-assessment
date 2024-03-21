import { ApiProperty } from "@nestjs/swagger";
import { Schema } from "mongoose";

export const OrderSchema = new Schema({
    userId: { type: String },
    subTotal: { type: Number },
    tax: { type: Number },
    taxInfo: { 
        taxName: String,
        amount: Number   
    },
    grandTotal: { type: Number },
    deliveryAddress: { type: String },
    deliveryDate: { type: String },
    deliveryTime: { type: String },
    deliveryInstruction: { type: String },
    deliveryCharges: { type: Number },
    paymentType: { type: String,
    default:"COD" },
    orderID: { type: Number },//CUSTOM
    address: { type: Object },
    totalProduct: { type: Number },
    orderType: { type: String },
    deliveredImage: { type: String },
    deliveredMessage: { type: String },
    deliveredDate: { type: Date },
    travelledDistance: { type: Number },
    distance:Number
}, {
    timestamps: true
});


export class OrderCreateDto {
    @ApiProperty()
    productId: string;

    @ApiProperty()
    quantity: number;
}