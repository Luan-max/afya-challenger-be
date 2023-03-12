import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePatientDto } from './dtos/create-patient.dto';
import { UpdatePatientDto } from './dtos/update.patient.dto';
import { Patient } from './entities/patient.entity';
import { PatientsService } from './patients.service';

@ApiTags('patients')
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @ApiOperation({ summary: 'Create new patient' })
  @ApiResponse({
    status: 201,
    description: 'Patient created with successfully!',
    type: Patient,
  })
  @ApiResponse({
    status: 400,
    description: 'Patient already exists',
    type: BadRequestException,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server expection error trying create patient',
    type: InternalServerErrorException,
  })
  @ApiBody({ type: CreatePatientDto })
  public async create(
    @Body() createPatientDto: CreatePatientDto,
  ): Promise<Patient> {
    return await this.patientsService.create(createPatientDto);
  }

  @Get()
  @ApiOperation({ summary: 'List patients' })
  @ApiResponse({
    status: 200,
    description: 'Patient listed with successfully',
    type: Patient,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server expection error trying list patients',
    type: InternalServerErrorException,
  })
  public async findAll(@Query('name') name: string): Promise<Patient[]> {
    return await this.patientsService.findAll(name);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an patient' })
  @ApiResponse({
    status: 204,
    description: 'No content',
  })
  @ApiResponse({
    status: 400,
    description: 'Patient you are trying to update does not exist',
    type: BadRequestException,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server expection error trying update patient',
    type: InternalServerErrorException,
  })
  @HttpCode(204)
  public async update(
    @Param('id') id: string,
    @Body() updatePatientDto: UpdatePatientDto,
  ): Promise<void> {
    return await this.patientsService.update(id, updatePatientDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an patient' })
  @ApiResponse({
    status: 204,
    description: 'No content',
  })
  @ApiResponse({
    status: 400,
    description: 'Patient you are trying to delete does not exist',
    type: BadRequestException,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server expection error trying delete patient',
    type: InternalServerErrorException,
  })
  @HttpCode(204)
  async remove(@Param('id') id: string): Promise<void> {
    return await this.patientsService.remove(id);
  }
}
