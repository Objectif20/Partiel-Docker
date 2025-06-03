import { Type } from 'class-transformer';
import { IsArray, IsEmail, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

class LocationDTO {
    @IsString()
    longitude: string;

    @IsString()
    latitude: string;
}

class ParcelDTO {
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    weight?: string;

    @IsString()
    @IsOptional()
    estimate_price?: string;

    @IsString()
    @IsOptional()
    fragility?: string;

    @IsString()
    @IsOptional()
    volume?: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    images?: string[];
}

class ShipmentDTO {
    @IsString()
    description: string;

    @IsString()
    @IsOptional()
    estimated_total_price?: string;

    @IsString()
    @IsOptional()
    proposed_delivery_price?: string;

    @IsString()
    @IsOptional()
    weight?: string;

    @IsString()
    @IsOptional()
    volume?: string;

    @IsString()
    @IsOptional()
    deadline_date?: string;

    @IsString()
    @IsOptional()
    time_slot?: string;

    @IsString()
    @IsOptional()
    urgent: string;

    @IsString()
    @IsOptional()
    status: string;

    @IsArray()
    @IsString({ each: true })
    keywords: string[];

    @IsString()
    departure_city: string;

    @ValidateNested()
    @Type(() => LocationDTO)
    departure_location: LocationDTO;

    @IsString()
    arrival_city: string;

    @ValidateNested()
    @Type(() => LocationDTO)
    arrival_location: LocationDTO;

    @IsString()
    delivery_mail: string;

    @IsString()
    arrival_handling: string;

    @IsString()
    handling_floor_arrival: string;

    @IsString()
    elevator_arrival: string;

    @IsString()
    departure_handling: string;

    @IsString()
    handling_floor_departure: string;

    @IsString()
    arrival_postal_code: string;

    @IsString()
    arrival_address: string;

    @IsString()
    departure_postal_code: string;

    @IsString()
    departure_address: string;

    @IsString()
    elevator_departure: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ParcelDTO)
    parcels: ParcelDTO[];

    img: Express.Multer.File;

}

export class CreateShipmentDTO {
    @ValidateNested()
    @Type(() => ShipmentDTO)
    shipment: ShipmentDTO;
    img: Express.Multer.File;
}
