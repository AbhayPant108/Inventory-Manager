import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, MongooseError, Types } from 'mongoose';
import { CreateSupplierDto } from './dtos/create-supplier.dto';
import { QuerySupplierDto } from './dtos/query-supplier.dto';
import { UpdateSupplierDto } from './dtos/update-supplier.dto';
import { Supplier } from './schemas/supplier.schema';

@Injectable()

export class SupplierService {
  constructor(
    @InjectModel(Supplier.name)
    private readonly supplierModel: Model<Supplier>,
  ) {}

  async create(createSupplierDto: CreateSupplierDto) {

    try {
      const supplier = await this.supplierModel.create({
        ...createSupplierDto,
      });

      return supplier;
    } catch (error) {
      this.handlePersistenceError(error);
    }
  }

  async findAll(queryDto: QuerySupplierDto = {}) {
    const filters = this.buildFilters(queryDto);

    return this.supplierModel
      .find({
        ...filters,
      })
      .sort({ updatedAt: -1, createdAt: -1 })
      .exec();
  }

  async findOne(id: string) {
    return this.findSupplierOrThrow(id);
  }

  async update(id: string, updateSupplierDto: UpdateSupplierDto) {
    try {
      const supplier = await this.findSupplierOrThrow(id );

      Object.assign(supplier, updateSupplierDto);
      await supplier.save();

      return supplier;
    } catch (error) {
      this.handlePersistenceError(error);
    }
  }

  async delete(id: string) {
    const supplier = await this.findSupplierOrThrow(id);

    try {
      await supplier.deleteOne();
      return;
    } catch (error) {
      this.handlePersistenceError(error);
    }
  }

  private buildFilters(queryDto: QuerySupplierDto) {
    const filters: Record<string, any> = {};

    if (queryDto.supplier_name) {
      filters.supplier_name = {
        $regex: queryDto.supplier_name,
        $options: 'i',
      };
    }

    if (queryDto.contact_person) {
      filters.contact_person = {
        $regex: queryDto.contact_person,
        $options: 'i',
      };
    }

    if (queryDto.email) {
      filters.email = {
        $regex: queryDto.email,
        $options: 'i',
      };
    }

    if (queryDto.phone) {
      filters.phone = {
        $regex: queryDto.phone,
        $options: 'i',
      };
    }

    return filters;
  }

  private async findSupplierOrThrow(id: string) {
    this.ensureValidObjectId(id, 'supplier id');

    const supplier = await this.supplierModel
      .findOne({ id: id })
      .exec();

    if (!supplier) {
      throw new NotFoundException('Supplier not found.');
    }

    return supplier;
  }

  private ensureValidObjectId(value: string, fieldName: string) {
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(
        `${fieldName} must be a valid MongoDB ObjectId.`,
      );
    }
  }

  private handlePersistenceError(error: any): never {
    if (error?.code === 11000) {
      throw new ConflictException(
        'A supplier with this name already exists for this user.',
      );
    }

    if (error?.name === 'ValidationError') {
      throw new BadRequestException('Validation failed.');
    }

    if (error instanceof MongooseError) {
      throw new InternalServerErrorException(
        'Failed to complete the supplier operation.',
      );
    }

    throw error;
  }
}
