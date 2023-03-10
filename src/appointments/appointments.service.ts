import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from '../patients/entities/patient.entity';
import { Repository } from 'typeorm';
import { CreateAppointmentDto } from '../appointments/dtos/create-appointment.dto';
import { Appointment } from '../appointments/entities/appointment.entity';

import { checkAppointmentAvailability } from './helpers/checkAppointmentAvailability.helper';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto) {
    try {
      const { patientId, startDate } = createAppointmentDto;

      const patient = await this.patientRepository.findOne({
        where: { id: patientId },
      });

      if (!patient) {
        throw new BadRequestException(
          'Patient does not exists for create appointment',
        );
      }

      const appointmentDate = startDate;
      const endDate = new Date(
        new Date(startDate).setHours(new Date().getHours() + 4),
      ).toISOString();

      const isAvailable = await checkAppointmentAvailability(
        this.appointmentRepository,
        appointmentDate,
        endDate,
      );

      if (isAvailable) {
        throw new BadRequestException(
          'You already have an appointment scheduled for this time',
        );
      }

      const create = await this.appointmentRepository.save({
        patientId,
        startDate: appointmentDate,
        endDate: endDate,
      });

      return create;
    } catch (error) {
      if (error instanceof BadRequestException)
        throw new BadRequestException({
          message: error.message,
          statusCode: HttpStatus.BAD_REQUEST,
        });

      throw new InternalServerErrorException({
        message: 'Internal server expection error trying create appointments',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
