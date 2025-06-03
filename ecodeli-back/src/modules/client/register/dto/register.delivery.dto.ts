import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsUUID } from 'class-validator';

export class RegisterDeliveryPersonDTO {

    @ApiProperty({
        description: 'The license number of the delivery person',
        example: 'ABC123456',
    })
    @IsString()
    license: string;

    @ApiProperty({
        description: 'The professional email of the delivery person',
        example: 'professional@example.com',
    })
    @IsEmail()
    professional_email: string;

    @ApiProperty({
        description: 'The phone number of the delivery person',
        example: '+33123456789',
    })
    @IsString()
    phone_number: string;

    @ApiProperty({
        description: 'The country where the delivery person is located',
        example: 'France',
    })
    @IsString()
    country: string;

    @ApiProperty({
        description: 'The city where the delivery person is located',
        example: 'Paris',
    })
    @IsString()
    city: string;

    @ApiProperty({
        description: 'The address of the delivery person',
        example: '123 Delivery St.',
    })
    @IsString()
    address: string;

    @ApiProperty({
        description: 'The postal code of the delivery person',
        example: '75001',
    })
    @IsString()
    postal_code: string;

    @ApiProperty({
        description: 'The language ID of the delivery person',
        example: 'en',
    })
    @IsString()
    @IsOptional()
    language_id?: string;


    @IsString()
    @IsOptional()
    signature?: string;
}
