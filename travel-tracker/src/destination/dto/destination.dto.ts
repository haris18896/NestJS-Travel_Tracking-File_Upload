import { IsDateString, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";

export class CreateDestinationDto {
    @IsNotEmpty()
    @IsString()
    name: string;


    @IsNotEmpty()
    @IsDateString()
    travelDate: Date;

    @IsOptional()
    @IsString()
    notes?: string;
}

export class UpdateDestinationDto extends PartialType(CreateDestinationDto) {}
