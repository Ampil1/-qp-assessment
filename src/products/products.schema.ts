import { Schema } from 'mongoose';


export const ProductSchema = new Schema({
	productName: { type: String },
	description: { type: String },
	sku: { type: String },
	variant: [
		{
			productStock: { type: Number },
			unit: { type: String },
			unitValue: { type: String },
			price: { type: Number },
		}
	],
    //mutiple imagaes
	productImages: [{
		imageUrl: { type: String },
		imageId: { type: String },
		filePath: { type: String },
	}
	],
	status: { type: Boolean, default: true },
	averageRating: { type: Number, default: 0 },
	totalRating: { type: Number, default: 0 },
	noOfUsersRated: { type: Number, default: 0 },
}, {
	timestamps: true
});