import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtService } from "src/config/jwt.service";
import { JwtModule } from "@nestjs/jwt";
import { Users } from "src/common/entities/user.entity";
import { Client } from "src/common/entities/client.entity";
import { Providers } from "src/common/entities/provider.entity";
import { DeliveryPerson } from "src/common/entities/delivery_persons.entity";
import { Merchant } from "src/common/entities/merchant.entity";
import { SharedModule } from "src/common/shared/shared.module";
import { PlanningController } from "./planning.controller";
import { PlanningService } from "./planning.service";
import { Appointments } from "src/common/entities/appointments.entity";
import { ServicesList } from "src/common/entities/services_list.entity";
import { Delivery } from "src/common/entities/delivery.entity";
import { Shipment } from "src/common/entities/shipment.entity";


@Module({
    imports: [
        TypeOrmModule.forFeature([Users, Client, Providers, DeliveryPerson, Merchant, Appointments, ServicesList, Delivery, Shipment]),
        JwtModule.register({}),
        SharedModule,
    ],
    controllers: [PlanningController],
    providers: [JwtService, PlanningController, PlanningService],
    exports: [TypeOrmModule, PlanningService],
})
export class PlanningModule {}