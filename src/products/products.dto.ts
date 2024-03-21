import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";


export class VariantDTO {
	@IsNotEmpty()
	@ApiProperty()
	productStock: number;

	@IsNotEmpty()
	@ApiProperty()
	unit: string;
    @ApiProperty()
	@IsOptional()
	unitValue?: any;

	@IsNotEmpty()
	@ApiProperty()
	price: number;

}
export class ProductsSaveDTO {

	@IsString()
	@ApiProperty()
	productName: string;

	@ApiProperty()
	@IsOptional()
	sku: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	description: string;

	@ApiProperty({ type: [VariantDTO] })
	// @ArrayMinSize(1)
	variant: Array<VariantDTO>;
}

export class ProductFilterQuery {
	page?: number;
	limit?: number;
}