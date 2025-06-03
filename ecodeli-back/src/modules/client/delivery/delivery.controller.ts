import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { DeliveryService } from "./delivery.service";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { CreateShipmentDTO } from "./dto/create-shipment.dto";
import { GetShipmentsDTO } from "./dto/get-shipment.dto";
import { CreateDeliveryDto } from "./dto/create-delivery.dto";
import { ClientJwtGuard } from "src/common/guards/user-jwt.guard";
import { BookPartialDTO } from "./dto/book-partial.dto";
import { DeliveryHistoryAsClient, HistoryDelivery, ShipmentHistoryRequest, ShipmentListItem, SubscriptionForClient } from "./types";
import { CreateShipmentTrolleyDTO } from "./dto/create-trolley.dto";
import { DeliveryStateService } from "./delivery-state.service";
import { ShipmentService } from "./shipment.service";
import { DeliveryUtilsService } from "./delivery-utils.service";

@Controller("client/shipments")
export class DeliveryController {

    constructor(
        private readonly deliveryService: DeliveryService,
        private readonly deliveryStateService: DeliveryStateService,
        private readonly shipmentService : ShipmentService,
        private readonly deliveryUtilsService : DeliveryUtilsService
    ) {}

    @Post()
    @UseGuards(ClientJwtGuard)
    @UseInterceptors(AnyFilesInterceptor())
    async createShipment(
        @Body() createShipmentDTO: CreateShipmentDTO,
        @UploadedFiles() files: Express.Multer.File[],
        @Req() req: { user: { user_id: string }; body: any }
    ) {
        const shipment = await this.shipmentService.createShipment(createShipmentDTO, files, req.user.user_id);
        return { message: "Shipment received successfully!", data: shipment };
    }

    @Post("/trolley")
    @UseGuards(ClientJwtGuard)
    @UseInterceptors(AnyFilesInterceptor())
    async createShipmentTrolley(
        @Body() createShipmentDTO: CreateShipmentTrolleyDTO,
        @UploadedFiles() files: Express.Multer.File[],
        @Req() req: { user: { user_id: string }; body: any }
    ) {
        const shipment = await this.shipmentService.createTrolleyShipment(createShipmentDTO, files, req.user.user_id);
        return { message: "Shipment Trolley received successfully!", data: shipment };
    }

    @Post('step')
    async createShipmentStep(@Body() createDeliveryDto: CreateDeliveryDto, @Body('updatedAmount') updatedAmount: number) {
      const delivery = await this.deliveryService.createStepDelivery(createDeliveryDto, updatedAmount);
      return { message: 'Shipment step created successfully', delivery };
    }

    @Get()
    async getShipments(@Query() filters: GetShipmentsDTO) {
        return this.shipmentService.getShipments(filters);
    }

    @Get("warehouses")
    async getWarehouses() {
        return this.deliveryUtilsService.getWarehouseList();
    }

    @Get("myCurrentShipmentsForNegotiation")
    @UseGuards(ClientJwtGuard)
    async getCurrentPendingShipments(
        @Body("user_id") user_id : string,
    ) {
        return this.deliveryUtilsService.getMyCurrentShipmentsForNegoctation(user_id);
    }

    @Get("onGoingDeliveries")
    @UseGuards(ClientJwtGuard)
    async getOngoingDeliveries(
        @Body("user_id") user_id : string,
    ) {
        return this.deliveryService.getOngoingDeliveries(user_id);
    }

    @Get("subscriptionStat")
    @UseGuards(ClientJwtGuard)
    async getSubscriptionStat(
        @Body("user_id") user_id : string,
    ) : Promise<SubscriptionForClient> {
        return this.deliveryUtilsService.getSubscriptionPlanForClient(user_id);
    }

    @Get("myCurrentShipments")
    @UseGuards(ClientJwtGuard)
    async getCurrentShipment(
        @Body("user_id") user_id : string,
    ) : Promise<ShipmentListItem[]> {
        return this.shipmentService.getShipmentListItems(user_id);
    }

    @Get("favorites")
    async getFavoriteShipments(
        @Query("page") page : number,
        @Query("limit") limit : number,
        @Body("user_id") user_id : string,
    ) {
        return this.deliveryService.getShipmentFavorites(user_id, page, limit);
    }

    @Post("delivery/:id/taken")
    @UseGuards(ClientJwtGuard)
    async takeDelivery(
        @Param("id") deliveryId : string,
        @Body("user_id") user_id : string,
        @Body("secretCode") secretCode : string,
    ) {
        return this.deliveryStateService.takeDeliveryPackage(deliveryId, user_id, secretCode);
    }

    @Post("delivery/:id/finish")
    @UseGuards(ClientJwtGuard)
    async finishDelivery(
        @Param("id") deliveryId : string,
        @Body("user_id") user_id : string,
    ) {
        return this.deliveryStateService.finishDelivery(deliveryId, user_id);
    }

    @Post("delivery/:id/validate")
    @UseGuards(ClientJwtGuard)
    async validateDelivery(
        @Param("id") deliveryId : string,
        @Body("user_id") user_id : string,
    ) {
        return this.deliveryStateService.validateDelivery(deliveryId, user_id);
    }

    @Post("delivery/:id/validateWithCode")
    @UseGuards(ClientJwtGuard)
    async validateDeliveryWithCode(
        @Param("id") deliveryId : string,
        @Body("user_id") user_id : string,
        @Body("secretCode") secretCode : string,
    ) {
        return this.deliveryStateService.validateDeliveryWithCode(deliveryId, user_id, secretCode);
    }

    @Delete("delivery/:id/cancel")
    @UseGuards(ClientJwtGuard)
    async cancelDelivery(
        @Param("id") deliveryId : string,
        @Body("user_id") user_id : string,
    ) {
        return this.deliveryService.cancelDelivery(deliveryId, user_id);
    }

    @Get("delivery/myHistory")
    @UseGuards(ClientJwtGuard)
    async getMyHistory(
        @Body("user_id") user_id : string,
        @Query("page") page : number,
        @Query("limit") limit : number,
    ) : Promise<{ data: HistoryDelivery[], totalRows: number }> {
        console.log("user_id", user_id);
        return this.deliveryService.getMyDeliveryHistory(user_id, page, limit);
    }

    @Get("delivery/myHistoryAsClient")
    @UseGuards(ClientJwtGuard)
    async getMyHistoryAsClient(
        @Body("user_id") user_id : string,
        @Query("page") page : number,
        @Query("limit") limit : number,
    ) : Promise<{ data: DeliveryHistoryAsClient[], totalRows: number }> {
        return this.deliveryService.getDeliveryHistoryAsClient(user_id, page, limit);
    }

    @Get("delivery/reviews")
    @UseGuards(ClientJwtGuard)
    async getMyReviews(
        @Body("user_id") user_id : string,
        @Query("page") page : number,
        @Query("limit") limit : number,
    ) {
        return this.deliveryUtilsService.getReviewsForDeliveryPerson(user_id, page, limit);
    }

    @Get("delivery/myReviews")
    @UseGuards(ClientJwtGuard)
    async getMyReviewsAsClient(
        @Body("user_id") user_id : string,
        @Query("page") page : number,
        @Query("limit") limit : number,
    ) {
        return this.deliveryUtilsService.getMyReviewsAsClient(user_id, page, limit);
    }

    @Get("myShipmentsHistory")
    @UseGuards(ClientJwtGuard)
    async getMyShipmentsHistory(
        @Body("user_id") user_id : string,
        @Query("page") page : number,
        @Query("limit") limit : number,
    ) : Promise<{ data: ShipmentHistoryRequest[], totalRows: number }> {
        return this.shipmentService.getMyShipmentsHistory(user_id, page, limit);
    }

    @Get("delivery/myLocation")
    @UseGuards(ClientJwtGuard)
    async getMyLocation(
        @Body("user_id") user_id : string,
    ) {
        return this.deliveryService.getDeliveriesLocation(user_id);
    }

    @Get("delivery/current")
    @UseGuards(ClientJwtGuard)
    async getCurrentDeliveriesAsClient(
        @Body("user_id") user_id : string
    ) {
        return this.deliveryService.getCurrentDeliveriesAsClient(user_id);
    }

    @Post("delivery/reviews/:id/reply")
    @UseGuards(ClientJwtGuard)
    async replyToComment(
        @Param("id") comment_id : string,
        @Body("user_id") user_id : string,
        @Body("content") content : string,
    ) {
        return this.deliveryUtilsService.replyComment(content, user_id, comment_id);
    }

    @Get("delivery/:id")
    @UseGuards(ClientJwtGuard)
    async getDeliveryById(
        @Param("id") delivery_id : string,
        @Body("user_id") user_id : string,
    ) {
        return this.deliveryService.getDeliveryDetails(user_id, delivery_id);
    }

    @Post("delivery/:id/comments")
    @UseGuards(ClientJwtGuard)
    async addComment(
        @Body("comment") comment : string,
        @Body("rate") rate : number,
        @Body("user_id") user_id : string,
        @Param("id") delivery_id : string,
    ) {
        return this.deliveryUtilsService.addComment(comment, user_id, delivery_id, rate);
    }

    @Post(":id/book")
    @UseGuards(ClientJwtGuard)
    async bookShipment(
        @Param("id") shipment_id : string,
        @Body("user_id") user_id : string,
    ) {
        return this.deliveryService.bookDelivery(shipment_id, user_id);
    }

    @Post(':id/bookPartial')
    @UseGuards(ClientJwtGuard)
    async bookPartial(
        @Param('id') id: string,
        @Body() bookPartialDTO: BookPartialDTO,
    ) {
        return this.deliveryService.bookPartial(bookPartialDTO, id);
    }

    @Post(":id/askNegociation")
    @UseGuards(ClientJwtGuard)
    async askNegociation(
        @Param("id") shipment_id : string,
        @Body("user_id") user_id : string
    )
    {
        return this.deliveryUtilsService.askToNegociate(shipment_id, user_id);
    }

    @Post("negociate")
    async negotiateShipment(
        @Body("shipment_id") shipmentId : string,
        @Body("user_id") user_id : string,
        @Body("updatedPrice") updatedPrice : number,
    ) {
        return this.deliveryService.createNegotiatedDelivery(shipmentId, user_id, updatedPrice);
    }

    @Post("favorite")
    async addFavoriteDelivery(
        @Body("user_id") user_id : string,
        @Body("shipment_id") shipment_id : string,
    ) {
        return this.deliveryService.addToFavorites(user_id, shipment_id);
    }

    @Delete("favorite/:id")
    async removeFavoriteDelivery(
        @Body("user_id") user_id : string,
        @Body("shipment_id") shipment_id : string,
    ) {
        return this.deliveryService.removeFromFavorites(user_id, shipment_id);
    }

    @Get("office/:id")
    @UseGuards(ClientJwtGuard)
    async getOfficeById(
        @Param("id") shipment_id : string,
    ) {
        return this.shipmentService.getShipmentDetails(shipment_id);
    }

    @Get(":id")
    async getShipmentById(
        @Param("id") shipment_id : string,
    ) {
        return this.shipmentService.getShipmentById(shipment_id);
    }

    @Patch(":id")
    async updateShipment() {
        return "Delivery updated successfully";
    }

    @Patch(":id/route")
    async updateDeliveryRoute() {
        return "Delivery route updated successfully";
    }

    @Get("delivery/:id/status")
    async getDeliveryStatus(
        @Param("id") deliveryId : string,
    ) {
        return this.deliveryService.getDeliveryStatus(deliveryId);
    }

    @Delete(":id")
    async deleteShipment(
        @Param("id") shipmentId : string,
        @Body("user_id") user_id : string,
    ) {
        return this.deliveryService.deleteShipment(shipmentId, user_id);
    }
}
