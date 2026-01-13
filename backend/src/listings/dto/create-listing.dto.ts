import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { FuelType, TransmissionType } from '../listing.entity';

export class CreateListingDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsInt()
    @Min(0)
    price: number;

    @IsNotEmpty()
    @IsInt()
    @Min(1900)
    year: number;

    @IsNotEmpty()
    @IsInt()
    @Min(0)
    mileage: number;

    @IsNotEmpty()
    @IsString()
    city: string;

    @IsNotEmpty()
    @IsString()
    make: string;

    @IsNotEmpty()
    @IsString()
    model: string;

    @IsNotEmpty()
    @IsString()
    engineCapacity: string;

    @IsNotEmpty()
    @IsEnum(TransmissionType)
    transmission: TransmissionType;

    @IsNotEmpty()
    @IsEnum(FuelType)
    fuel: FuelType;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    features?: string[];
}
