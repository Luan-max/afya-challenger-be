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
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dtos/create-appointment.dto';
import { Appointment } from './entities/appointment.entity';

@ApiTags('appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @ApiOperation({ summary: 'Create a new appointment' })
  @Post()
  @ApiResponse({
    status: 201,
    description: 'appointment created successfully..',
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
}
