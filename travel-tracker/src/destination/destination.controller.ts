import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/Auth-Guard/jwt-auth.guard';
import { DestinationService } from './destination.service';
import { CreateDestinationDto, UpdateDestinationDto } from './dto/destination.dto';

@Controller('destination')
@UseGuards(JwtAuthGuard)
export class DestinationController {
    constructor(private readonly destinationService: DestinationService) {}

    @Post('create-destination')
    create(@Request() req: any, @Body() createDestinationDto: CreateDestinationDto) {
        return this.destinationService.create(req.user.userId, createDestinationDto);
    }

    @Get('get-all-destinations')
    findAll(@Request() req: any) {
        return this.destinationService.findAll(req.user.userId);
    }

    @Get('get-destination/:id')
    findOne(@Request() req: any, @Param('id') id: string) {
        return this.destinationService.findOne(+id);
    }

    @Delete('delete-destination/:id')
    removeDestination(@Request() req: any, @Param('id') id: string) {
        return this.destinationService.removeDestination(+id);
    }

    @Patch('update-destination/:id')
    updateDestination(@Request() req: any, @Param('id') id: string, @Body() updateDestinationDto: UpdateDestinationDto) {
        return this.destinationService.updateDestination(+id, updateDestinationDto);
    }

}