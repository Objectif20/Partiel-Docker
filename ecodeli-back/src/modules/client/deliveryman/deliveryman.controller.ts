import { Controller, Post, Get, Body, Query, UseGuards, Req, UploadedFile, UploadedFiles, UseInterceptors, Param } from '@nestjs/common';
import { DeliveryManService, Route, RoutePostDto } from './deliveryman.service';
import { ClientJwtGuard } from 'src/common/guards/user-jwt.guard';
import { Vehicle } from 'src/common/entities/vehicle.entity';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express/multer';

@Controller('client/deliveryman')
export class DeliveryManController {
  constructor(private readonly deliveryManService: DeliveryManService) {}

  @Post('trips')
  @UseGuards(ClientJwtGuard)
  async createTrip(
    @Query('user_id') userId: string,
    @Body() routeData: RoutePostDto,
  ) {
    return this.deliveryManService.createTrip(userId, routeData);
  }

  @Get('trips')
  @UseGuards(ClientJwtGuard)
  async getTrips(
    @Query('user_id') userId: string,
  ): Promise<Route[]> {
    return this.deliveryManService.getTripsByDeliveryPerson(userId);
  }

  @Post('vehicle')
@UseGuards(ClientJwtGuard)
@UseInterceptors(FileFieldsInterceptor([
  { name: 'image', maxCount: 1 },
  { name: 'document', maxCount: 1 },
]))
async addVehicle(
  @Req() req: { user: { user_id: string }; body: any },
  @Body() vehicleData: { 
    model: string, 
    registrationNumber: string, 
    electric: boolean, 
    co2Consumption: number, 
    categoryId: number
  },
  @UploadedFiles() files: { 
    image?: Express.Multer.File[], 
    document?: Express.Multer.File[] 
  },
): Promise<Vehicle> {
  console.log('User ID:', req.user.user_id);
  console.log('Vehicle data:', vehicleData);
  console.log('Received files:', files);

  const image = files.image?.[0];
  const document = files.document?.[0];

  if (!image || !document) {
    throw new Error('Required files are missing');
  }

  return this.deliveryManService.addVehicle(req.user.user_id, { ...vehicleData, image, document });
}

  @Get('my-vehicles')
  @UseGuards(ClientJwtGuard)
  async getMyVehicules(
    @Body('user_id') userId: string,  
    @Query('page') page: number = 1,   
    @Query('limit') limit: number = 10
  ) {
    console.log('User ID:', userId);
    return this.deliveryManService.getMyVehicles(userId, page, limit);
  }

  @Get('vehicle-categories')
  @UseGuards(ClientJwtGuard)
  async getVehicleCategories() {
    return this.deliveryManService.getVehicleCategories();
  }

  @Get('admissible/:id')
  @UseGuards(ClientJwtGuard)
  async isDeliveryManAdmissible(
    @Body('user_id') userId: string,
    @Param('id') id: string,
  ) {
    return this.deliveryManService.isDeliveryPersonIsAdmissibleForThisDelivery(userId, id);
  }

  @Get(':id/admissible')
  @UseGuards(ClientJwtGuard)
  async isDeliveryMan1dmissible(
    @Param('id') id: string,
  ) {
    return this.deliveryManService.isUserAdmissibleForDelivery(id);
  }




}
