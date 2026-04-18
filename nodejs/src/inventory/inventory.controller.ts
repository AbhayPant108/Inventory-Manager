import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import {
  createInventorySchema,
  type CreateInventoryDto,
} from './dtos/create-inventory.dto';
import {
  adjustInventorySchema,
  stockQuantitySchema,
  type AdjustInventoryDto,
  type StockQuantityDto,
} from './dtos/inventory-quantity.dto';
import {
  queryInventorySchema,
  type QueryInventoryDto,
} from './dtos/query-inventory.dto';
import {
  updateInventorySchema,
  type UpdateInventoryDto,
} from './dtos/update-inventory.dto';
import { ZodValidationPipe } from '../zodValidation.pipe';
import ApiResponse from '../../utils/api.response';
import {type PayloadDto } from 'src/auth/dtos/payload.dto';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  async create(
    @Body(new ZodValidationPipe(createInventorySchema))
    createInventoryDto: CreateInventoryDto,user:PayloadDto
  ) {
    const inventory = await this.inventoryService.create(createInventoryDto,user.id);

    return new ApiResponse(
      'Inventory record created successfully.',
      HttpStatus.CREATED,
      inventory,
    );
  }

  @Get()
  async findAll(
    @Query(new ZodValidationPipe(queryInventorySchema))
    queryInventoryDto: QueryInventoryDto,user:PayloadDto
  ) {
    const inventoryItems =
      await this.inventoryService.findAll(queryInventoryDto,user.id);

    return new ApiResponse(
      'Inventory records fetched successfully.',
      HttpStatus.OK,
      inventoryItems,
    );
  }

  @Get('low-stock')
  async findLowStock(
    @Query(new ZodValidationPipe(queryInventorySchema))
    queryInventoryDto: QueryInventoryDto,user:PayloadDto
  ) {
    const inventoryItems =
      await this.inventoryService.findLowStock(queryInventoryDto,user.id);

    return new ApiResponse(
      'Low stock inventory records fetched successfully.',
      HttpStatus.OK,
      inventoryItems,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string,user:PayloadDto) {
    const inventory = await this.inventoryService.findOne(id,user.id);

    return new ApiResponse(
      'Inventory record fetched successfully.',
      HttpStatus.OK,
      inventory,
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateInventorySchema))
    updateInventoryDto: UpdateInventoryDto,user:PayloadDto
  ) {
    const inventory = await this.inventoryService.update(id, updateInventoryDto,user.id);

    return new ApiResponse(
      'Inventory record updated successfully.',
      HttpStatus.OK,
      inventory,
    );
  }

  @Patch(':id/adjust-stock')
  async adjustStock(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(adjustInventorySchema))
    adjustInventoryDto: AdjustInventoryDto,user:PayloadDto
  ) {
    const inventory = await this.inventoryService.adjustStock(
      id,
      adjustInventoryDto,user.id
    );

    return new ApiResponse(
      'Inventory stock adjusted successfully.',
      HttpStatus.OK,
      inventory,
    );
  }

  @Patch(':id/restock')
  async restock(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(stockQuantitySchema))
    stockQuantityDto: StockQuantityDto,user:PayloadDto
  ) {
    const inventory = await this.inventoryService.restock(id, stockQuantityDto,user.id);

    return new ApiResponse(
      'Inventory restocked successfully.',
      HttpStatus.OK,
      inventory,
    );
  }

  @Patch(':id/reserve')
  async reserveStock(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(stockQuantitySchema))
    stockQuantityDto: StockQuantityDto,user:PayloadDto
  ) {
    const inventory = await this.inventoryService.reserveStock(
      id,
      stockQuantityDto,user.id,
    );

    return new ApiResponse(
      'Inventory reserved successfully.',
      HttpStatus.OK,
      inventory,
    );
  }

  @Patch(':id/release')
  async releaseReservedStock(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(stockQuantitySchema))
    stockQuantityDto: StockQuantityDto,user:PayloadDto
  ) {
    const inventory = await this.inventoryService.releaseReservedStock(
      id,
      stockQuantityDto,user.id,
    );

    return new ApiResponse(
      'Reserved inventory released successfully.',
      HttpStatus.OK,
      inventory,
    );
  }

  @Patch(':id/consume-reserved')
  async consumeReservedStock(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(stockQuantitySchema))
    stockQuantityDto: StockQuantityDto,user:PayloadDto
  ) {
    const inventory = await this.inventoryService.consumeReservedStock(
      id,
      stockQuantityDto,user.id,
    );

    return new ApiResponse(
      'Reserved inventory consumed successfully.',
      HttpStatus.OK,
      inventory,
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: string,user:PayloadDto) {
    await this.inventoryService.delete(id,user.id);

    return new ApiResponse(
      'Inventory record deleted successfully.',
      HttpStatus.OK,
    );
  }
}
