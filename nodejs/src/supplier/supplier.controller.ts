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
  UseGuards,
} from '@nestjs/common';
import { type PayloadDto } from '../auth/dtos/payload.dto';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../auth/user.decorator';
import { ZodValidationPipe } from '../zodValidation.pipe';
import ApiResponse from '../../utils/api.response';
import {
  createSupplierZodSchema,
  type CreateSupplierDto,
} from './dtos/create-supplier.dto';
import {
  querySupplierSchema,
  type QuerySupplierDto,
} from './dtos/query-supplier.dto';
import {
  updateSupplierZodSchema,
  type UpdateSupplierDto,
} from './dtos/update-supplier.dto';
import { SupplierService } from './supplier.service';

@Controller('supplier')
@UseGuards(AuthGuard)
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
  async create(
    @Body(new ZodValidationPipe(createSupplierZodSchema))
    createSupplierDto: CreateSupplierDto,
    @User() user: PayloadDto,
  ) {
    const supplier = await this.supplierService.create(createSupplierDto);

    return new ApiResponse(
      'Supplier created successfully.',
      HttpStatus.CREATED,
      supplier,
    );
  }

  @Get()
  async findAll(
    @Query(new ZodValidationPipe(querySupplierSchema))
    querySupplierDto: QuerySupplierDto,
    @User() user: PayloadDto,
  ) {
    const suppliers = await this.supplierService.findAll(querySupplierDto);

    return new ApiResponse(
      'Suppliers fetched successfully.',
      HttpStatus.OK,
      suppliers,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @User() user: PayloadDto) {
    const supplier = await this.supplierService.findOne(id);

    return new ApiResponse(
      'Supplier fetched successfully.',
      HttpStatus.OK,
      supplier,
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateSupplierZodSchema))
    updateSupplierDto: UpdateSupplierDto,
    @User() user: PayloadDto,
  ) {
    const supplier = await this.supplierService.update(
      id,
      updateSupplierDto,
    );

    return new ApiResponse(
      'Supplier updated successfully.',
      HttpStatus.OK,
      supplier,
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @User() user: PayloadDto) {
    await this.supplierService.delete(id);

    return new ApiResponse('Supplier deleted successfully.', HttpStatus.OK);
  }
}
