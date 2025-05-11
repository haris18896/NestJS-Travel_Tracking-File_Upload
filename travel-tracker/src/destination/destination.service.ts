import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDestinationDto, UpdateDestinationDto } from './dto/destination.dto';

@Injectable()
export class DestinationService {
    constructor(private readonly prisma: PrismaService) {
        
    }

    async create(userId: number, createDestinationDto: CreateDestinationDto) {
        return this.prisma.destination.create({
            data: {
                ...createDestinationDto,
                travelDate: new Date(createDestinationDto.travelDate).toISOString(),
                userId,
            },
        });
    }

    async findAll(userId: number) {
        const destinations = await this.prisma.destination.findMany({
            where: {
                userId,
            },
        });

        return destinations;
    }

    async findOne(id: number) {
        const destination = await this.prisma.destination.findFirst({
            where: {
                id,
            },
        });

        if (!destination) {
            throw new NotFoundException('Destination not found');
        }

        return destination;
    }

    async removeDestination(id: number) {
        const destination = await this.prisma.destination.findUnique({
            where: { id },
        });
    

        if (!destination) {
            throw new NotFoundException('Destination not found');
        }

        await this.prisma.destination.delete({
            where: { id },
        });    

        return {
            message: 'Destination deleted successfully',
        };
    }

    async updateDestination(id: number, updateDestinationDto: UpdateDestinationDto) {
        const destination = await this.prisma.destination.findUnique({
            where: { id },
        });

        if (!destination) {
            throw new NotFoundException('Destination not found');
        }

        const updateDestination = await this.prisma.destination.update({
            where: { id },
            data: updateDestinationDto,
        });

        return {
            message: 'Destination updated successfully',
            updateDestination,
        };
    }
}
