import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from '../patients/entities/patient.entity';
import { Repository } from 'typeorm';
import { CreateAppointmentDto } from '../appointments/dtos/create-appointment.dto';
import { UpdateAppointmentDto } from '../appointments/dtos/update-appointment.dto';
import { Appointment } from '../appointments/entities/appointment.entity';

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
        throw new Error('Patient does not exists for create appointment');
      }

      const appointmentDate = startDate;
      const endDate = new Date(
        new Date(startDate).setHours(new Date().getHours() + 4),
      ).toISOString();

      const create = await this.appointmentRepository.save({
        patientId,
        startDate: appointmentDate,
        endDate: endDate,
      });

      return create;
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Internal server expection error trying create appointments',
        statusCode: 500,
      });
    }
  }

  async findAll(): Promise<Appointment[]> {
    try {
      const appointments = await this.appointmentRepository.find();
      return appointments;
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Internal server expection error trying list appointments',
        statusCode: 500,
      });
    }
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    try {
      const { startDate } = updateAppointmentDto;

      const appointmentDate = startDate;
      const endDate = new Date(
        new Date(startDate).setHours(new Date().getHours() + 4),
      ).toISOString();

      await this.appointmentRepository.update(id, {
        startDate: appointmentDate,
        endDate,
      });

      return;
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Internal server expection error trying update appointments',
        statusCode: 500,
      });
    }
  }

  async remove(id: string) {
    try {
      const appointmentsExists = await this.patientRepository.findOne({
        where: {
          id,
        },
      });

      if (!appointmentsExists)
        throw new Error('Appointment you are trying to delete does not exist');

      await this.appointmentRepository.delete(id);

      return;
    } catch (error) {
      if (
        error.message === 'Appointment you are trying to delete does not exist'
      )
        throw new BadRequestException({
          message: error.message,
          statusCode: 400,
        });

      throw new InternalServerErrorException({
        message: 'Internal server expection error trying update patient',
        statusCode: 500,
      });
    }
  }
}
