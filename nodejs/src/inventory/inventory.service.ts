import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, MongooseError, Types } from 'mongoose';
import { CreateInventoryDto } from './dtos/create-inventory.dto';
import {
  type AdjustInventoryDto,
  type StockQuantityDto,
} from './dtos/inventory-quantity.dto';
import { type QueryInventoryDto } from './dtos/query-inventory.dto';
import { type UpdateInventoryDto } from './dtos/update-inventory.dto';
import {
  LOW_STOCK_STATUSES,
  type InventoryStatus,
} from './inventory.constants';
import {
  Inventory,
  type InventoryDocument,
} from './schemas/inventory.schema';


@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(Inventory.name)
    private readonly inventoryModel: Model<Inventory>,
  ) {}

  async create(createInventoryDto: CreateInventoryDto,userID:string) {
    // Step 1: Validate the incoming data
    this.validateReferenceIds(createInventoryDto);
    this.ensureValidObjectId(userID,'user id')  // validate refrence ids
    this.validateStockState(                        // validate stock state (nonnegative and quantity>res_qntity)
      createInventoryDto.quantity,
      createInventoryDto.reserved_quantity,
      createInventoryDto.low_stock_threshold,
    );

    try {
      // Step 2: Create a new inventory document
      const inventory = await this.inventoryModel.create({
        ...createInventoryDto,
        user_id: userID,
        status: this.resolveStatus(
          createInventoryDto.quantity,
          createInventoryDto.reserved_quantity,
          createInventoryDto.low_stock_threshold,
        ),
      });
      // Step 3: return the created document
      return inventory.toJSON();
    } catch (error) {
      // handle error
      this.handlePersistenceError(error);
    }
  }

  async findAll(queryDto: QueryInventoryDto = {},userID:string) {
    // Step 1: Generate the filter object based on query
    const filters = this.buildFilters(queryDto);
    this.ensureValidObjectId(userID,'user id')
    // Step 2: Find inventories docs using filter object
    const inventoryItems = await this.inventoryModel
      .find({
        ...filters,
        user_id:userID
      })
      .sort({ updatedAt: -1, createdAt: -1 })
      .exec();
    // Step 3: Return the items array
    return inventoryItems.map((inventory) => inventory.toJSON());
  }

  async findLowStock(queryDto: QueryInventoryDto = {},userID:string) {
    // find only low Stock items
    return this.findAll({
      ...queryDto,
      low_stock_only: true,
    },userID);
  }

  async findOne(id: string,userID:string) {
    const inventory = await this.findInventoryOrThrow(id,userID);
    return inventory.toJSON();
  }

  async update(id: string, updateInventoryDto: UpdateInventoryDto,userID:string) {
    // Step 1: Check if the inventory doc exsists
    const inventory = await this.findInventoryOrThrow(id,userID);
    // Step 2: Validate the incoming data
    this.validateReferenceIds(updateInventoryDto);
    // Step 3: Update the quantity,reserved_quantity and low_stock_threshold if provided
    const nextQuantity = updateInventoryDto.quantity ?? inventory.quantity;
    const nextReservedQuantity =
      updateInventoryDto.reserved_quantity ?? inventory.reserved_quantity;
    const nextLowStockThreshold =
      updateInventoryDto.low_stock_threshold ?? inventory.low_stock_threshold;
    // Step 4: Validate the Stock state
    this.validateStockState(
      nextQuantity,
      nextReservedQuantity,
      nextLowStockThreshold,
    );
    // Step 5: Copy the data to inventory doc
    Object.assign(inventory, updateInventoryDto, {
      status: this.resolveStatus(
        nextQuantity,
        nextReservedQuantity,
        nextLowStockThreshold,
      ),
    });
    // Step 6: Return the document
    return this.persistInventory(inventory);
  }

  async adjustStock(id: string, adjustInventoryDto: AdjustInventoryDto,userID:string) {
    // Step 1: Find inventory by Id
    const inventory = await this.findInventoryOrThrow(id,userID);
    // Step 2: New Quantity
    const nextQuantity =
      inventory.quantity + adjustInventoryDto.quantity_change;
    // Step 3: validate new stock state
    this.validateStockState(
      nextQuantity,
      inventory.reserved_quantity,
      inventory.low_stock_threshold,
    );
    // Step 4: update the quantiy in document
    inventory.quantity = nextQuantity;
    // Step 5: update the status in document
    inventory.status = this.resolveStatus(
      inventory.quantity,
      inventory.reserved_quantity,
      inventory.low_stock_threshold,
    );
    // Step 6: return document
    return this.persistInventory(inventory);
  }
  // Restocking the item in inventory
  async restock(id: string, stockQuantityDto: StockQuantityDto,userID:string) {
    const inventory = await this.findInventoryOrThrow(id,userID);

    inventory.quantity += stockQuantityDto.quantity;
    inventory.status = this.resolveStatus(
      inventory.quantity,
      inventory.reserved_quantity,
      inventory.low_stock_threshold,
    );

    return this.persistInventory(inventory);
  }
  // When customer reserve some items to purchase
  async reserveStock(id: string, stockQuantityDto: StockQuantityDto,userID:string) {
    const inventory = await this.findInventoryOrThrow(id,userID);
    const availableQuantity = inventory.quantity - inventory.reserved_quantity;

    if (stockQuantityDto.quantity > availableQuantity) {
      throw new BadRequestException(
        'Not enough available stock to reserve the requested quantity.',
      );
    }

    inventory.reserved_quantity += stockQuantityDto.quantity;
    inventory.status = this.resolveStatus(
      inventory.quantity,
      inventory.reserved_quantity,
      inventory.low_stock_threshold,
    );

    return this.persistInventory(inventory);
  }
  // When customer cancel the purchase: release reserved stock but quantity remain same
  async releaseReservedStock(id: string, stockQuantityDto: StockQuantityDto,userID:string) {
    const inventory = await this.findInventoryOrThrow(id,userID);

    if (stockQuantityDto.quantity > inventory.reserved_quantity) {
      throw new BadRequestException(
        'Cannot release more than the currently reserved quantity.',
      );
    }

    inventory.reserved_quantity -= stockQuantityDto.quantity;
    inventory.status = this.resolveStatus(
      inventory.quantity,
      inventory.reserved_quantity,
      inventory.low_stock_threshold,
    );

    return this.persistInventory(inventory);
  }
  // When customer actually purchase some items: release reserved stock and quantity decreases
  async consumeReservedStock(id: string, stockQuantityDto: StockQuantityDto,userID:string) {
    const inventory = await this.findInventoryOrThrow(id,userID);

    if (stockQuantityDto.quantity > inventory.reserved_quantity) {
      throw new BadRequestException(
        'Cannot consume more than the currently reserved quantity.',
      );
    }

    inventory.reserved_quantity -= stockQuantityDto.quantity;
    inventory.quantity -= stockQuantityDto.quantity;
    inventory.status = this.resolveStatus(
      inventory.quantity,
      inventory.reserved_quantity,
      inventory.low_stock_threshold,
    );

    return this.persistInventory(inventory);
  }

  async delete(id: string,userID:string) {
    const inventory = await this.findInventoryOrThrow(id,userID);

    try {
      await inventory.deleteOne();
      return;
    } catch (error) {
      this.handlePersistenceError(error);
    }
  }
  
  private buildFilters(queryDto: QueryInventoryDto) {
    const filters: Record<string, any> = {};

    if (queryDto.store_id) {
      filters.store_id = new Types.ObjectId(queryDto.store_id);
    }

    if (queryDto.supplier_id) {
      filters.supplier_id = new Types.ObjectId(queryDto.supplier_id);
    }

    if (queryDto.product_id) {
      filters.product_id = new Types.ObjectId(queryDto.product_id);
    }

    if (queryDto.location_in_store) {
      filters.location_in_store = {
        $regex: queryDto.location_in_store,
        $options: 'i',
      };
    }

    if (queryDto.status) {
      filters.status = queryDto.status;
    } else if (queryDto.low_stock_only) {
      filters.status = {
        $in: LOW_STOCK_STATUSES,
      };
    }

    return filters;
  }

  private async findInventoryOrThrow(id: string,userID:string) {
    this.ensureValidObjectId(id, 'inventory id');
    this.ensureValidObjectId(userID,'user id')

    const inventory = await this.inventoryModel.findOne({_id:id,user_id:userID}).exec();

    if (!inventory) {
      throw new NotFoundException('Inventory record not found.');
    }

    return inventory;
  }

  private async persistInventory(inventory: InventoryDocument) {
    try {
      await inventory.save();
      return inventory.toJSON();
    } catch (error) {
      this.handlePersistenceError(error);
    }
  }

  private validateReferenceIds(
    inventoryDto: Partial<
      Pick<CreateInventoryDto, 'store_id' | 'supplier_id' | 'product_id'>
    >,
  ) {
    // Gives error if any _id is invalid
    if (inventoryDto.store_id) {
      this.ensureValidObjectId(inventoryDto.store_id, 'store_id');
    }

    if (inventoryDto.supplier_id) {
      this.ensureValidObjectId(inventoryDto.supplier_id, 'supplier_id');
    }

    if (inventoryDto.product_id) {
      this.ensureValidObjectId(inventoryDto.product_id, 'product_id');
    }
  }

  private ensureValidObjectId(value: string, fieldName: string) {
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(
        `${fieldName} must be a valid MongoDB ObjectId.`,
      );
    }
  }

  private validateStockState(
    quantity: number,
    reservedQuantity: number,
    lowStockThreshold: number,
  ) {
    if (quantity < 0) {
      throw new BadRequestException('Quantity cannot be negative.');
    }

    if (reservedQuantity < 0) {
      throw new BadRequestException('Reserved quantity cannot be negative.');
    }

    if (lowStockThreshold < 0) {
      throw new BadRequestException('Low stock threshold cannot be negative.');
    }

    if (reservedQuantity > quantity) {
      throw new BadRequestException(
        'Reserved quantity cannot exceed total quantity.',
      );
    }
  }

  private resolveStatus(
    quantity: number,
    reservedQuantity: number,
    lowStockThreshold: number,
  ): InventoryStatus {
    const availableQuantity = Math.max(quantity - reservedQuantity, 0);

    if (availableQuantity === 0) {
      return 'OUT_OF_STOCK';
    }

    if (availableQuantity <= lowStockThreshold) {
      return 'LOW_STOCK';
    }

    return 'IN_STOCK';
  }

  private handlePersistenceError(error: any): never {
    if (error?.code === 11000) {
      throw new ConflictException(
        'An inventory record already exists for this store, supplier, product, and location.',
      );
    }

    if (error?.name === 'ValidationError') {
      throw new BadRequestException('Validation failed.');
    }

    if (error instanceof MongooseError) {
      throw new InternalServerErrorException(
        'Failed to complete the inventory operation.',
      );
    }

    throw error;
  }
}
