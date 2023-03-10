import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dtos/create-appointment.dto';
import { UpdateAppointmentDto } from './dtos/update-appointment.dto';
import { Appointment } from './entities/appointment.entity';

@ApiTags('appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @ApiOperation({ summary: 'Create a new appointment' })
  @Post()
  @ApiResponse({
    status: 201,
    description: 'Appointment created successfully',
    type: Appointment,
  })
  @ApiResponse({
    status: 400,
    description: 'You already have an appointment scheduled for this time',
    type: BadRequestException,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server expection error trying create appointment',
    type: InternalServerErrorException,
  })
  async create(
    @Body() createAppointmentDto: CreateAppointmentDto,
  ): Promise<CreateAppointmentDto> {
    return await this.appointmentsService.create(createAppointmentDto);
  }

  @ApiOperation({ summary: 'List appointments' })
  @Get()
  @ApiOkResponse({
    isArray: true,
    description: 'Returns a list of appointments',
    type: Appointment,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server expection error trying list patients',
    type: InternalServerErrorException,
  })
  public async findAll(): Promise<Appointment[]> {
    return this.appointmentsService.findAll();
  }

  @ApiOperation({ summary: 'Update an appointment' })
  @Put(':id')
  @ApiResponse({
    status: 200,
    description: 'Appointment updated successfully',
    type: Appointment,
  })
  @ApiResponse({
    status: 400,
    description: 'You already have an appointment scheduled for this time',
    type: BadRequestException,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server expection error trying update appointment',
    type: InternalServerErrorException,
  })
  @HttpCode(204)
  public async update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<void> {
    return this.appointmentsService.update(id, updateAppointmentDto);
  }
}
